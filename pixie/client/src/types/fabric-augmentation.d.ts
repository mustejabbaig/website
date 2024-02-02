// HACK: This should somehow add the EraserBrush to the fabric namespace
declare module fabric {
  export class EraserBrush extends PencilBrush {
  }
}
import 'fabric';
