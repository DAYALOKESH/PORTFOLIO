"""
Portfolio project endpoints.
Handles CRUD operations for portfolio projects.
"""
from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status
from sqlmodel import select, col

from app.api.deps import CurrentSuperuser, SessionDep
from app.models.project import (
    Project,
    ProjectCreate,
    ProjectPublic,
    ProjectUpdate,
)


router = APIRouter(prefix="/projects", tags=["Portfolio Projects"])


# ============== Public Endpoints ==============

@router.get("", response_model=list[ProjectPublic])
async def list_projects(
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    featured_only: bool = Query(False),
) -> list[ProjectPublic]:
    """
    List all portfolio projects.
    
    Args:
        skip: Pagination offset
        limit: Max projects to return
        featured_only: Only return featured projects
        
    Returns:
        List of projects sorted by order
    """
    statement = (
        select(Project)
        .order_by(col(Project.order).asc())
        .offset(skip)
        .limit(limit)
    )
    
    if featured_only:
        statement = statement.where(Project.is_featured == True)
    
    projects = session.exec(statement).all()
    return projects


@router.get("/{project_id}", response_model=ProjectPublic)
async def get_project(
    session: SessionDep,
    project_id: UUID,
) -> ProjectPublic:
    """
    Get a single project by ID.
    
    Args:
        project_id: Project UUID
        
    Returns:
        Project details
    """
    project = session.get(Project, project_id)
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return project


# ============== Admin Endpoints ==============

@router.post("", response_model=ProjectPublic, status_code=status.HTTP_201_CREATED)
async def create_project(
    session: SessionDep,
    current_user: CurrentSuperuser,
    project_in: ProjectCreate,
) -> ProjectPublic:
    """
    Create a new portfolio project - Admin only.
    
    Args:
        project_in: Project creation data
        
    Returns:
        Created project
    """
    project = Project(**project_in.model_dump())
    
    session.add(project)
    session.commit()
    session.refresh(project)
    
    return project


@router.put("/{project_id}", response_model=ProjectPublic)
async def update_project(
    session: SessionDep,
    current_user: CurrentSuperuser,
    project_id: UUID,
    project_in: ProjectUpdate,
) -> ProjectPublic:
    """
    Update a portfolio project - Admin only.
    
    Args:
        project_id: Project UUID
        project_in: Update data
        
    Returns:
        Updated project
    """
    project = session.get(Project, project_id)
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    update_data = project_in.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    for key, value in update_data.items():
        setattr(project, key, value)
    
    session.add(project)
    session.commit()
    session.refresh(project)
    
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    session: SessionDep,
    current_user: CurrentSuperuser,
    project_id: UUID,
) -> None:
    """
    Delete a portfolio project - Admin only.
    
    Args:
        project_id: Project UUID
    """
    project = session.get(Project, project_id)
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    session.delete(project)
    session.commit()


@router.put("/reorder", response_model=list[ProjectPublic])
async def reorder_projects(
    session: SessionDep,
    current_user: CurrentSuperuser,
    project_orders: list[dict],
) -> list[ProjectPublic]:
    """
    Reorder projects by updating their order values - Admin only.
    
    Args:
        project_orders: List of {"id": UUID, "order": int} dicts
        
    Returns:
        Updated list of projects
    """
    for item in project_orders:
        project = session.get(Project, item["id"])
        if project:
            project.order = item["order"]
            project.updated_at = datetime.now(timezone.utc)
            session.add(project)
    
    session.commit()
    
    # Return updated list
    projects = session.exec(
        select(Project).order_by(col(Project.order).asc())
    ).all()
    
    return projects
