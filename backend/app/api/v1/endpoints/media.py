"""
Media upload endpoints.
Handles image uploads with validation and processing.
"""
from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.api.deps import CurrentSuperuser
from app.services.storage import storage_service, validate_image_upload
from app.services.image import process_image


router = APIRouter(prefix="/media", tags=["Media"])


@router.post("/upload")
async def upload_media(
    current_user: CurrentSuperuser,
    file: UploadFile = File(..., description="Image file to upload"),
    optimize: bool = True,
) -> dict:
    """
    Upload an image file - Admin only.
    
    Args:
        file: Image file (JPEG, PNG, WebP)
        optimize: Whether to optimize/resize the image (default: True)
        
    Returns:
        Upload result with filename and URL
    """
    # Read file content
    content = await file.read()
    file_size = len(content)
    
    # Validate
    is_valid, error_message = validate_image_upload(
        content_type=file.content_type or "application/octet-stream",
        file_size=file_size,
    )
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_message,
        )
    
    # Process image if optimization requested
    if optimize:
        try:
            processed_content, content_type = process_image(content)
            # Update filename extension to match output format
            original_name = file.filename or "upload"
            if "." in original_name:
                base_name = original_name.rsplit(".", 1)[0]
            else:
                base_name = original_name
            filename = f"{base_name}.webp"
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )
    else:
        processed_content = content
        content_type = file.content_type or "image/jpeg"
        filename = file.filename or "upload.jpg"
    
    # Upload to storage
    result = await storage_service.upload_file(
        file_content=processed_content,
        original_filename=filename,
        content_type=content_type,
        subfolder="images",
    )
    
    return {
        "filename": result["filename"],
        "url": result["url"],
        "key": result["key"],
        "size": len(processed_content),
        "content_type": content_type,
    }


@router.delete("/delete")
async def delete_media(
    current_user: CurrentSuperuser,
    key: str,
) -> dict:
    """
    Delete an uploaded file - Admin only.
    
    Args:
        key: File key/path from upload response
        
    Returns:
        Deletion status
    """
    success = await storage_service.delete_file(key)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )
    
    return {"deleted": True, "key": key}
