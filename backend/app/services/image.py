"""
Image processing service.
Handles image optimization and resizing.
"""
from io import BytesIO
from PIL import Image

from app.core.logging import logger


# Maximum dimensions for processed images
MAX_WIDTH = 1920
MAX_HEIGHT = 1920
QUALITY = 85


def process_image(
    file_content: bytes,
    max_width: int = MAX_WIDTH,
    max_height: int = MAX_HEIGHT,
    quality: int = QUALITY,
    output_format: str = "WEBP"
) -> tuple[bytes, str]:
    """
    Process and optimize an image.
    
    Args:
        file_content: Original image bytes
        max_width: Maximum width (will resize proportionally)
        max_height: Maximum height (will resize proportionally)
        quality: Output quality (1-100)
        output_format: Output format (WEBP, JPEG, PNG)
        
    Returns:
        Tuple of (processed bytes, content_type)
    """
    try:
        # Open image
        img = Image.open(BytesIO(file_content))
        
        # Convert RGBA to RGB for JPEG/WEBP (remove alpha channel)
        if img.mode in ("RGBA", "LA", "P"):
            # Create white background
            background = Image.new("RGB", img.size, (255, 255, 255))
            if img.mode == "P":
                img = img.convert("RGBA")
            background.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
            img = background
        elif img.mode != "RGB":
            img = img.convert("RGB")
        
        # Resize if larger than max dimensions
        original_size = img.size
        img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
        
        if img.size != original_size:
            logger.info(f"Image resized from {original_size} to {img.size}")
        
        # Save to bytes
        output = BytesIO()
        
        if output_format.upper() == "WEBP":
            img.save(output, format="WEBP", quality=quality, method=6)
            content_type = "image/webp"
        elif output_format.upper() == "JPEG":
            img.save(output, format="JPEG", quality=quality, optimize=True)
            content_type = "image/jpeg"
        elif output_format.upper() == "PNG":
            img.save(output, format="PNG", optimize=True)
            content_type = "image/png"
        else:
            # Default to WEBP
            img.save(output, format="WEBP", quality=quality, method=6)
            content_type = "image/webp"
        
        return output.getvalue(), content_type
        
    except Exception as e:
        logger.error(f"Image processing error: {e}")
        raise ValueError(f"Failed to process image: {e}")


def create_thumbnail(
    file_content: bytes,
    width: int = 400,
    height: int = 300
) -> tuple[bytes, str]:
    """
    Create a thumbnail from an image.
    
    Args:
        file_content: Original image bytes
        width: Thumbnail width
        height: Thumbnail height
        
    Returns:
        Tuple of (thumbnail bytes, content_type)
    """
    try:
        img = Image.open(BytesIO(file_content))
        
        # Convert mode if needed
        if img.mode in ("RGBA", "LA", "P"):
            background = Image.new("RGB", img.size, (255, 255, 255))
            if img.mode == "P":
                img = img.convert("RGBA")
            background.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
            img = background
        elif img.mode != "RGB":
            img = img.convert("RGB")
        
        # Create thumbnail (maintains aspect ratio)
        img.thumbnail((width, height), Image.Resampling.LANCZOS)
        
        # Save as WEBP
        output = BytesIO()
        img.save(output, format="WEBP", quality=80, method=6)
        
        return output.getvalue(), "image/webp"
        
    except Exception as e:
        logger.error(f"Thumbnail creation error: {e}")
        raise ValueError(f"Failed to create thumbnail: {e}")


def get_image_dimensions(file_content: bytes) -> tuple[int, int]:
    """
    Get the dimensions of an image.
    
    Args:
        file_content: Image bytes
        
    Returns:
        Tuple of (width, height)
    """
    img = Image.open(BytesIO(file_content))
    return img.size
