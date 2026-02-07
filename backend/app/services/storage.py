"""
Storage service for file uploads.
Supports local file storage (dev) and S3 (production).
"""
import asyncio
import os
import shutil
from pathlib import Path
from uuid import uuid4
from datetime import datetime

from app.core.config import settings
from app.core.logging import logger


class StorageService:
    """Abstract storage service for file uploads."""
    
    def __init__(self) -> None:
        self.use_local = settings.USE_LOCAL_STORAGE
        self.local_path = Path(settings.LOCAL_STORAGE_PATH)
        
        if self.use_local:
            self._ensure_local_dirs()
    
    def _ensure_local_dirs(self) -> None:
        """Create local storage directories if they don't exist."""
        self.local_path.mkdir(parents=True, exist_ok=True)
        (self.local_path / "images").mkdir(exist_ok=True)
        (self.local_path / "media").mkdir(exist_ok=True)
        logger.info(f"Local storage initialized at: {self.local_path.absolute()}")
    
    def _generate_filename(self, original_filename: str) -> str:
        """Generate a unique filename with timestamp and UUID."""
        ext = Path(original_filename).suffix.lower()
        timestamp = datetime.utcnow().strftime("%Y%m%d")
        unique_id = uuid4().hex[:8]
        safe_name = Path(original_filename).stem[:50]  # Limit original name
        # Remove special characters from name
        safe_name = "".join(c for c in safe_name if c.isalnum() or c in "-_")
        return f"{timestamp}_{unique_id}_{safe_name}{ext}"
    
    async def upload_file(
        self,
        file_content: bytes,
        original_filename: str,
        content_type: str,
        subfolder: str = "images"
    ) -> dict[str, str]:
        """
        Upload a file to storage.
        
        Args:
            file_content: File bytes
            original_filename: Original filename from upload
            content_type: MIME type of the file
            subfolder: Subfolder within storage (images, media, etc.)
            
        Returns:
            Dict with filename and url
        """
        filename = self._generate_filename(original_filename)
        
        if self.use_local:
            return await self._upload_local(file_content, filename, subfolder)
        else:
            return await self._upload_s3(file_content, filename, content_type)
    
    async def _upload_local(
        self,
        file_content: bytes,
        filename: str,
        subfolder: str
    ) -> dict[str, str]:
        """Upload file to local filesystem."""
        folder = self.local_path / subfolder
        # Use asyncio.to_thread for blocking I/O
        await asyncio.to_thread(folder.mkdir, exist_ok=True)
        
        file_path = folder / filename
        # Use asyncio.to_thread for blocking I/O
        await asyncio.to_thread(file_path.write_bytes, file_content)
        
        # Return URL path relative to static serving
        url = f"/uploads/{subfolder}/{filename}"
        
        logger.info(f"File uploaded locally: {file_path}")
        
        return {
            "filename": filename,
            "url": url,
            "key": f"{subfolder}/{filename}"
        }
    
    async def _upload_s3(
        self,
        file_content: bytes,
        filename: str,
        content_type: str
    ) -> dict[str, str]:
        """Upload file to S3 bucket."""
        import boto3
        from botocore.exceptions import ClientError
        
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )
        
        key = f"uploads/{filename}"
        
        try:
            s3_client.put_object(
                Bucket=settings.AWS_BUCKET,
                Key=key,
                Body=file_content,
                ContentType=content_type,
            )
            
            url = f"https://{settings.AWS_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
            
            logger.info(f"File uploaded to S3: {url}")
            
            return {
                "filename": filename,
                "url": url,
                "key": key
            }
        except ClientError as e:
            logger.error(f"S3 upload error: {e}")
            raise
    
    async def delete_file(self, key: str) -> bool:
        """
        Delete a file from storage.
        
        Args:
            key: File key/path
            
        Returns:
            True if deleted successfully
        """
        if self.use_local:
            return await self._delete_local(key)
        else:
            return await self._delete_s3(key)
    
    async def _delete_local(self, key: str) -> bool:
        """Delete file from local filesystem."""
        file_path = self.local_path / key
        
        # Use asyncio.to_thread for blocking I/O
        if await asyncio.to_thread(file_path.exists):
            await asyncio.to_thread(file_path.unlink)
            logger.info(f"File deleted locally: {file_path}")
            return True
        
        logger.warning(f"File not found for deletion: {file_path}")
        return False
    
    async def _delete_s3(self, key: str) -> bool:
        """Delete file from S3 bucket."""
        import boto3
        from botocore.exceptions import ClientError
        
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )
        
        try:
            s3_client.delete_object(
                Bucket=settings.AWS_BUCKET,
                Key=key,
            )
            logger.info(f"File deleted from S3: {key}")
            return True
        except ClientError as e:
            logger.error(f"S3 delete error: {e}")
            return False


# Singleton instance
storage_service = StorageService()


# Validation helpers
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


def validate_image_upload(
    content_type: str,
    file_size: int
) -> tuple[bool, str]:
    """
    Validate an image upload.
    
    Args:
        content_type: MIME type
        file_size: Size in bytes
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if content_type not in ALLOWED_IMAGE_TYPES:
        return False, f"Invalid file type. Allowed: {', '.join(ALLOWED_IMAGE_TYPES)}"
    
    if file_size > MAX_FILE_SIZE:
        max_mb = MAX_FILE_SIZE / (1024 * 1024)
        return False, f"File too large. Maximum size: {max_mb}MB"
    
    return True, ""
