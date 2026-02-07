"""
Markdown processing and sanitization service.
Converts Markdown to safe HTML with XSS protection.
"""
import markdown
import bleach
from bleach.css_sanitizer import CSSSanitizer


# Allowed HTML tags for sanitization
ALLOWED_TAGS = [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr",
    "b", "i", "strong", "em", "u", "s", "del", "ins",
    "a", "img",
    "pre", "code", "kbd", "samp",
    "ul", "ol", "li",
    "blockquote", "q", "cite",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td",
    "div", "span",
    "abbr", "sup", "sub",
]

# Allowed attributes per tag
ALLOWED_ATTRIBUTES = {
    "a": ["href", "title", "target", "rel"],
    "img": ["src", "alt", "title", "width", "height", "loading"],
    "abbr": ["title"],
    "td": ["colspan", "rowspan"],
    "th": ["colspan", "rowspan", "scope"],
    "code": ["class"],  # For syntax highlighting
    "pre": ["class"],
    "div": ["class"],
    "span": ["class"],
}

# Allowed URL schemes
ALLOWED_PROTOCOLS = ["http", "https", "mailto"]

# Markdown extensions to enable
MARKDOWN_EXTENSIONS = [
    "fenced_code",
    "tables",
    "toc",
    "nl2br",
    "smarty",
    "attr_list",
    "def_list",
    "footnotes",
    "md_in_html",
]


def convert_markdown_to_html(markdown_text: str) -> str:
    """
    Convert Markdown text to HTML.
    
    Args:
        markdown_text: Raw Markdown string
        
    Returns:
        HTML string (not yet sanitized)
    """
    md = markdown.Markdown(
        extensions=MARKDOWN_EXTENSIONS,
        output_format="html5"
    )
    return md.convert(markdown_text)


def sanitize_html(html: str) -> str:
    """
    Sanitize HTML to prevent XSS attacks.
    
    Args:
        html: Potentially unsafe HTML string
        
    Returns:
        Sanitized HTML string with only allowed tags/attributes
    """
    cleaned = bleach.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        protocols=ALLOWED_PROTOCOLS,
        strip=True,
    )
    
    # Linkify plain URLs
    cleaned = bleach.linkify(
        cleaned,
        callbacks=[_add_target_blank],
        skip_tags=["pre", "code"],
    )
    
    return cleaned


def _add_target_blank(attrs: dict, new: bool = False) -> dict:
    """
    Callback to add target="_blank" and rel="noopener" to links.
    """
    attrs[(None, "target")] = "_blank"
    attrs[(None, "rel")] = "noopener noreferrer"
    return attrs


def process_markdown(markdown_text: str) -> str:
    """
    Full pipeline: Convert Markdown to HTML and sanitize.
    
    Args:
        markdown_text: Raw Markdown string
        
    Returns:
        Safe, sanitized HTML string
    """
    html = convert_markdown_to_html(markdown_text)
    return sanitize_html(html)


def extract_excerpt(markdown_text: str, max_length: int = 200) -> str:
    """
    Extract a plain text excerpt from Markdown content.
    
    Args:
        markdown_text: Raw Markdown string
        max_length: Maximum length of excerpt
        
    Returns:
        Plain text excerpt without HTML tags
    """
    html = convert_markdown_to_html(markdown_text)
    # Strip all HTML tags
    plain_text = bleach.clean(html, tags=[], strip=True)
    # Normalize whitespace
    plain_text = " ".join(plain_text.split())
    
    if len(plain_text) <= max_length:
        return plain_text
    
    # Truncate at word boundary
    truncated = plain_text[:max_length].rsplit(" ", 1)[0]
    return truncated + "..."
