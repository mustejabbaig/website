import { CanvasObject } from "./CanvasObject";

/* TODO: implement this */
export class Layer
{
  id: number = 0;
  isCurrentlyActive: boolean = false;
  objects : CanvasObject[] = [];
  
  constructor(id: number = 0, isCurrentlyActive: boolean = false) {
    this.id = id;
    this.isCurrentlyActive = isCurrentlyActive;
  }
  
  public activate() {
    this.isCurrentlyActive = true;
  }

  public deactivate() {
    this.isCurrentlyActive = false;
  }

  /**
   * @todo why do we need something like this, when the variable is so accesible??
   * @returns 
   */
  public isActive(): boolean {
    return this.isCurrentlyActive;
  }

  public getId(): number {
    return this.id;
  }

  public setId(newId: number) {
    this.id = newId;
  }

  /**
   * as the name suggests, the objects will be ordered by zLevel, from low to high
   */
  sortObjectsByZLevel()
  {
      this.objects.sort(cmpObjByZ);
  }
}

function cmpObjByZ(a : CanvasObject, b : CanvasObject)
{
  return a.zLevelInternal - b.zLevelInternal;
}