## Additional Use Cases
*Note: Most criteria of the app which could be deemed as a "use case" are already mostly outlined concisely in AnforderungsanalyseFinal.md this is more of a clarification of some of them.*

### Starting Page
- The user wants to have an intuitive upload button
    - The user wants to be able to only upload pictures
    - The user should be redirected to a different site (the *editor*) after successfully uploading a picture to edit it.
    - The user wants to be able to upload images via dragging and dropping them from the OS onto the button
    - The user wants to be able to click on the button and be greeted with the standard OS file choosing mechanisms to upload the picture
- The user wants to see the name of the application above the upload button
- The user wants to get an error message when uploading a non-image file
    - The user wants to be able to try to upload pictures as many times as he wants after getting the error message

### Editor - General (this is the structure of the following user stories)
- The user wants to have four areas, one at the top, one at the right, one on the left and one in the center
    - The user wants to be able to use layering, whichs settings will be displayed in the right area
    - The user wants to access the general functionality from the area at the top
    - The user wants to access specific functionality regarding the general functionality at the left area
    - The user wants to see the uploaded picture in the center area
    - The user wants to see any made changes visualized in the image in the center

### Basic functionalities (as defined in AnforderungsanalyseFinal.md - Top Border core functionality)
- The user wants to select all the availible tools via buttons or a dropdown-menu on the top-bar
- When selecting a tool, the user wants to get visual feedback (highlighting the button for example)
- Furthermore, the user wants to have all the detailled functionality of this highlighted tool to be displayed on the left area.


## User Stories

- The user wants a starting page which introduces him to the application
    - *Completeness criteria:*
        - The user wants to use a URL to get to the starting page
        - The user wants to be able to use the URL from any modern browser on any OS
    - *Time required / estimated effort*:
        - 2 days


- As a user of the image editing app, I want to upload a photo I took during my vacation so that I can begin the editing process.
    - *Completeness Criteria:*
        - I should be able to upload an image.


- As a user of the image editing app, I want to ensure that I can only select valid image types when uploading a photo.
    - *Completeness Criteria:*
        - The system should validate and only accept recognized image file formats.


- As a user of the image editing app, I want to have the flexibility to make various changes to my uploaded photo.
    - *Completeness Criteria:*
        - I should be able to freely apply edits, such as filters, cropping, and adjustments.

- As a user of the image editing app, I want to save the changes made to my photo and download the edited image to my device.
    - *Completeness Criteria:*
        - I should be able to save the changes made during the editing process.
        - The edited image should be downloadable to my device


	- *Time required / estimated effort:*
		- combined time of all the times down from here


### Editor - Layering (left side) 
- As a casual photography editor, I want to be able use multiple layers in my picture editing process, so that I can add a PNG picture with a transparent background on top of my personal background. 
    - *Completeness criteria:* 
        - After initially uploading an image, the user wants to have only one layer (containing the uploaded one)
        - The user wants the different layers visualized as rectangles
            - The user wants the rectangles to have a preview of their content
        - I want to be able to create a new empty layer that lies on top of or under my image, accessible via a button under the last layer
        - I want to be able to freely select one or more layers I want to work on
        - I want to change the order of the layers
        - I want to see all the layers I have
        - The user wants to be able to upload additional images into new or existing layers via rightclicking the layer
            - After unchecking the last active checkbox, the user wants to get a warning, telling him, that there is no active layer.
            - The user wants to get a warning telling him that all data in this layer will be lost.
            - The user wants to be able to upload a picture via dragging it from the OS onto the rectangle.
            - The user wants all the changes made to the image only made to the active layers, whenever this is possible.
        - If an image is on a higher layer it should always be above the ones below
        - I should be able to select, move, scale, and rotate objects within each layer
        - I should be able to merge layers via rightclicking a layer and choosing the choice from the menu
            - The user wants to choose the layers he wants to merge with the rightclicked one
        - I should be able to delete layers via rightclicking a layer and choosing the choice from the menu
            - After deleting a layer, the user wants to get a warning telling him, that all data inside will be lost. This warning can either be accepted or the operation cancelled.
            - The user wants the rectangle to be removed from the view after choosing to delete the layer.
    - *Time required / estimated effort:*
        - 5.5 days
### Editor - Top Bar and left Bar (functionality)

### Basic functionalities (as defined in AnforderungsanalyseFinal.md - Top Border core functionality)
- As a meticulous editor, I want to be able to quickly undo any change I have made, as well as redo any options I have undone, so that I can easily jump back and choose a different option.
- *Completeness criteria:*
    - The editor should save a "editing history" for the current session
    - When I press undo the last edit I added should be undone
    - I can press undo multiple times
    - When there is nothing to undo, the button should do nothing and be greyed out
    - When I press redo the last edit I undid should be redone
    - I can press redo multiple times
    - When there is nothing to redo, the button should do nothing
    - *Time required / estimated effort:*
        - 3 days

- The user wants to save the picture with all it's pending changes, and also wants to be able to upload a new picture either into a new/existing layer or into a completly new project
    - *Completeness criteria:*
        - The user wants to be able to choose the image format in which the picture will get saved
        - When choosing to upload a completly new image, the user wants to get a warning, telling him, all the unsaved changes will be lost.
        - When choosing to upload a image into existing layers, the user wants to get a warning telling him that all the information in these layers will be lost.
        - The user wants to be able to cancel the load/save operations at any step.
    - Time required / estimated effor:
        - 2 days

- As a casual photographer, I want to be able to select a part of an image, so that I can not only freely edit only this part of the image, but also be able to copy, cut, delete, or move only this part of the image.
    - *Completeness criteria:* 
        - I can make a rectangular selection
        - I can make a free-hand selection
        - I want to select elements which I added before
        - I should be able to easily tell visually what I have selected
        - I can freely choose the size of this selection my holding down my mouse-button and dragging until I reach my desired size
        - Once I have a selection, I should only be able to edit inside this selection
        - When I press delete or move the selection, only the selection should be affected
        - If I copy or cut the selection, only the selection should be copied to my clipboard
        - I want to be able to paste the contents of the clipboard onto active layers
    -  *Time required / estimated effort:*
        - 14 days

- As a social media user, I want to rotate my horizontal picture by 90 degrees, so that I can upload it in a vertical format.
    - *Completeness criteria:* 
        - I can rotate an uploaded image clockwise or counter-clockwise by 90° or 180°
        - The resulting image should have no loss in quality and should not be distorted
    - *Time required / estimated effort:*
        - 1 day

- As a user, I want to mirror my picture on the y-axis or x-axis (centred to image), so that I can easily read the inverted text I took a picture of.
    - *Completeness criteria:* 
        - I want to be able to select the mirroring option and mirror my image on the x- or y-axis (centred to the image), creating an inverted/mirrored version
        - The mirrored image should maintain high quality and clarity, even with mirroring effects applied
    - *Time required / estimated effort:*
        - 1 day

- As an annotator, I want to draw onto my images in different colors and thicknesses using a pencil-like tool, as well as adding text onto my image, so that I can add different kinds of notes to my picture.
    - *Completeness criteria:* 
        - I can choose pencil/brush tool
        - I can draw on the picture
        - I can change the color of the tool
        - I can change the thickness of the tool
        - I can change the shape of the brush
        - I can choose a preset from a list of different ones
        - I can select the text editing tool
        - I can change the font
        - I can change the font size
        - I can change the text color
        - The user wants to click on another position of already existing text in the current "text-box" to be able to add symbols before these other position.
        - The user wants to be able to select parts of added text (for example "This is m*y tex*t, where the user wants to select *y tex*).
            - The user wants to be able to set selected or all text bold.
            - The user wants to be able to set selected or all text italic.
            - The user wants to be able to set selected or all text underlined.
        - I can add text anywhere I click on the image
        - I can choose the eraser to delete previously made drawings
    - *Time required / estimated effort:*
        - 8 days (5 days brushes + 3 days text)

- As a social media user, I want to be able to crop my picture to certain dimension so that I can easily upload this as my profile picture on a social media site.
    - *Completeness criteria:*
        - I should be able to choose the crop tool
        - I want to freely crop the image into a desired rectangular shape
        - I want to be able select certain preset ratios
    - *Time required / estimated effort:*
        - 2.5 days


### Additional functionality
- As a user with limited storage space, I want to be able to compress my pictures to lower their file size so that I can keep them on my phone.
    - *Completeness criteria:* 
        - I am able to access the compression option
        - I can compress picture to lower file size
        - The compression retains as much information as possible (Acceptable cut-off needs to be discussed / perhaps user can choose quality setting)
    - *Time required / estimated effort:*
        - 2.5 days
- As a tech-savvy photographer, I want to move two historical structures in my image closer together without distorting them by removing the space between them via a content-aware tool, so that I can get an image of them next to each other.
    - *Completeness criteria:*
        - I want to be able to choose a content-aware / contrast aware scaling option
        - I want to choose how much my image should be cropped / scale horizontally
        - In the resulting image, the main subjects should be moved closer together
        - The subjects should be affected minimally
    - *Time required / estimated effort:*
        - 7 days
- As a landscape photographer, I want to be able to freely adjust the color levels (for example brightness, saturation, contrast) of my image, so that I can change the quality of the picture.
    - *Completeness criteria:*
        - I want a multitude of color adjustment options (Hue, Saturation, Filters, ...)
        - I want to be able to choose the sharpening option
            - I should be able to choose the level of sharpening
        - After selecting hue, I want to change the hue levels of the different colors freely through a slider
        - After selecting saturation, I want to be able to increase or decrease the color saturation of the image through a slider
        - After selecting the filter option, I want to be able to browse the available filters
        - When I select a filter, if available, I want to be able to choose its intensity
        - If not available or after the intensity is set, I want to be able to apply the filter
    - *Time required / estimated effort:*
        - 12 days
- (As an user of the app, I want to be able to loosely draw a selection around an object and let the editor select the object automatically, I then want to be able to remove the object using a content-aware fill option, so that there is no empty gap left behind after the removal.
    - *Completeness criteria:*
        - I want to be able to choose the smart selection tool
        - If I draw around an object, the editor will adjust the selection to fit snugly around the object
        - After the object is selected, it should have the same properties as a normal selection (Being able to see that it is selected, only being able to affect the selection, ...)
        - When an object is selected, I want to be able to choose the object removal option
        - The object removal option should delete the selected image an fill the emptiness with what the editor thinks should be there (content-aware, comparing with the rest of the background)
    - *Time required / estimated effort:*
        - 20.5 days)