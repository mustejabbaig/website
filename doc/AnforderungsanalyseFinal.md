# Anforderungsanalyse

## Introduction
This web application should enable the user to easily upload pictures from their hard drive, edit and subsequently download them, using a browser of their choice.

This document will include the application's requirements from the **users** perspective and the requirements and testing conditions from our, the **developers**, point of view, including criteria for the applications quality.


## User perspective
### Starting page
The starting page contains the name and a short description/introduction of this application. Beneath that is a button, enabling the user to select a file via the OS standard way of selecting a file.

Ideally, the user should only be able to select one of the following image types [png, apng, aviv, bmp, jpg/jpeg, gif].
In case the chosen file is a valid image type, the user will be directed to the next page, from here on referred to as the **Editor**. Otherwise the user will be shown an error message and a prompt to try again. The general layout of this page doesn't change
On a technical note: The uploaded valid image file will be converted into data-structures which allow the developers to more easily transform and edit pixel information. The uploaded picture will be the first and only layer on the next screen. More on that later in a different document regarding the technical aspect of the implementation.

Now we will take a look at the softwares centerpiece:

## Editor
## GENERAL LAYOUT AND LAYERING
The Editor is divided into 4 areas:
- **Center - Image**:
Here the image and its edits and transformations will be displayed. The image is locked to the bottom (with a 5% border space) and fills out 75% of the space to the top, left and right, effectivly making borders there which contain functionality.
- **Top Border - Core Functionality**:
This contains 3 clickable buttons on the right aligned to the center (of the border), labeled "menu", "undo" and "redo". The "menu"-button is a dropdown-menu which will contain the more complex image related functionalities.

Further on the right, there are buttons with "basic" functionalities, which are used most of the time. It contains buttons in 2 areas. The first area will be named "file" containing the buttons with the labels "save", "save to", "load new image".
The second row contains buttons with labels "select", "rotate" ,"crop", "brush", "add text", "mirror".

- **Left Border - Detailed functionality**
The left border contains detailed information or input possibilities for a selected feature. For example, when the "brush" tool is selected, the user should be able to change its color, thickness and so on.
We will go into detail on all the different features, since this area is very dynamic and changes its contents depending on the specific function.
- **Right Border - Layer**
This contains information and input possibilities for layering in the image.
In a list, there will be all the layers, ordered top to bottom. Each Layer is represented by a preview of its contents. All layers will have a checkbox on their left side. If ticked, changes made to the image will only be made to this layer.
Right beneath the last rectangle, there is a "plus"-button, which allows the user to create another layer, which will result into creating another rgba-matrix with white color information and a 0-alpha channel for all the entries (effectively making it a transparent picture on top of the loaded one).
By default there is only one layer (containing the loaded image) which is ticked.
The user is allowed to untick all checkboxes, but they will be informed, that editing wont be possible. 

    When right-clicking on a rectangle, the user should be presented with the pop-up option of uploading a picture into this layer, to combine this layer with another one, or to delete this layer. 
    - **Uploading a picture**: This has the same functionality as clicking the corresponding button in the top bar. So for more information, *see below*.
    - **Combine layer**:
    A window will pop up with all the other possible layers. Upon selecting one and pressing **OK** the user will get a warning which tells them that this action is not reversable. After accepting that, the corresponding matrices will be additivly mixed into a new matrix, which then will be presented as a new layer taking place of the first selected one for combining. The two combined layers will be removed permanently.
    - **Delete layer**:
    After accepting the prompt telling the user that all unsaved progress will be lost inside this layer, the layer will be removed from the layer view and the image.

We now will be going into all the different features which the user will be able to select from the **Top Border**, how the program should behave, and how the other areas will react accordingly.
Some words regarding choosing functionality in general:
- It is possible that the same functionality can be chosen from the "menu"-dropdown or the basic buttons. If a functionality is chosen, either from the dropdown or the basic area and there is a corresponding button in the basic area, this button will be highlighted by displaying it subscript.
- When a functionality is selected, the name of this functionality will be displayed at the top of the left border, under which the detailed input possibilities are displayed. These will be described next.
- When hovering over a functionality, a small tool-tip will be displayed at the mouse position.
- Only one feature from the top bar can be selected at once. Selecting one will deselect the previous one. Exceptions are: **Copy, Cut, Paste, Save** and **Load**, which will be doing something *once* and normally the beforehand selected functionality is still the active one.

These general features are, combined with the layering, the applications core functionalities.

## CORE FEATURES OF THE EDITOR
- **Save** and **Save to**
This will save the transformed and edited picture on the users PC. When selecting **Save**, the user is prompted with a window where he should be able to select the image type, he wants to save his picture as. It will be downloaded corresponding to the users browser settings. When the user selects "save to", the standard OS-Way of saving files to a specific location is used.
To make this work, we have to convert all the matrices containing color information into the selected image-file type (Supported Filetypes [png, jpg, avif, gif, webp] ). This should not take longer than 2 seconds.
- **Load new image**
After clicking this, the user will be prompted with a window with the following choices, which will only be given, if there is more than one layer. If there is only one layer, the third step is chosen:
    1. "Load into selected layer" -> this will load the selected picture into all active layers!
    When selecting this option, the user should get a warning, that the current layer will be overriden, which the user has to accept (or abort).
    2. "Load into new layer" -> this will load the selected picture into a new created layer at the bottom.
    3. "Load completly new image" -> this step is equivalent with loading a picture from the starting screen. When selecting this option, the user should get a warning, that all unsaved progress will be lost, which the user has to accept (or abort). After loading the image, the editor will be "reset": This is like loading an image from the starting screen.
    
    Whatever option the user chooses, when not aborted at any step, the next step will be the OS-Way of choosing a picture (restricted to the formats described at the starting page), which then should not take longer than 2 seconds to load. 
    The user also has the option to cancel before selecting a choice.
- **Select**
*Selecting* will always happen in all the active layers. When something *selected*, it is stored inside the clipboard, there will be no information about the layers. When pasting something from the clipboard, it will be pasted into all active layers.
The select-feature is the first feature which also impacts the left border, which will now contain four buttons underneath the text in *subarea1*, from which the user can select them in the same way as from the top bar. They are labeled: "Select user element", "Rectangle Select", "Freehand Select", and "Select All". Underneath this button, there will be another small area (*subarea2*) with the following 3 buttons: "Move", "Copy", "Cut", "Paste", "Remove".
These 4 buttons will be grayed out and not selectable until there is something *selected* (See below).
    - *subarea1*
        - **Select user element**
        When clicking on a user element (e.g. text, primitives, ..., *see below*), the current selected functionality should change to the one which was responsible for creating this element. For example, if selecting a text-field, the user should be able to edit the text with the "Add text" functionality described later on.
        When there are user elements, which can be selected with this method, they will have a label in their description (in this document).
        - **Rectangle Select**
        This is selected by default. The mouse cursor will be a small dashed rectangle. When above the picture, the user can click with the left mouse button from point A, hold it down and move the mouse to point B, where the mouse button will be released. A--B is the diagonal of the rectangle which is now *selected*, which the user knows, because the selected rectangle will be bordered and a dark filter will be laid inside, effectively reducing the contrast of the pixels in this rectangle.
        This (visual) rectangle will already be displayed when moving the mouse with the pressed mouse button - dynamically (which means, it changes "in real time" to the current position of the cursor).
        - **Freehand Select**
        The mouse cursor will be a small dashed "deformed" circle. When above the picture, the user can click with the left mouse button on point A, hold it down and move the cursor around. The "Moving around" will be traced and displayed as a dashed trace. If the user traces a valid shape, valid in this case being a closed one, this area will have the same visual clues as the rectangle described above. When releasing the mouse button, this area is final and now *selected*.
        - **Select all**
        Here the rectangle from the top left corner to the bottom right corner will be *selected* automatically with the same visual clues described above.

    After *selecting* something, the buttons of *subarea2* will be accessible, with the exception of the **Paste** button, which only will be accessible after putting something (image related) into the clipboard. The same functionality can be achieved by pressing key-combinations described in brackets below (exception: "Move"):
    - *subarea2*
        - **Move**
        After clicking onto the *selected* area, while holding the mouse button down, the area can be moved around in all active layers. This will effectivly override pixel information of where the new position of the area pixels are. Pixels at the previous location of the selected area will be transparent, if they are not overwritten. After the release, the changes will be applied permanently.
        When pixel information is moved out of the bounds of the image, this data will not be saved.
        - **Copy (CTRL+C)**
        Copies the *selected* bit into the clipboard. This will result in a popup lasting 2 seconds, telling the user, that the copy-process was successful.
        - **Cut (CTRL+X)**
        Equivalent to 'Copy', with the difference that the *selected* pixels will be made transparent (rgba: 255,255,255,0)
        - **Paste (CTRL+V)**
        The clipboard data will be *copied* into the selected area into **all** active layers. The area doesn't restrict the copied information in any way. If something is *selected*, the top leftmost pixel of this selected area will be the "starting point" of the clipboard data.
        If nothing is selected, the top left pixel of the picture will be this starting point.
        - **Remove (DEL)**
        Similar to 'Cut', but nothing will be put inside the clipboard. The selected area will be made transparent in all selected layers.
    
    All of the above described actions should be happening without a delay that the user could notice. (40 ms?)

- **Rotate** 
The cursor will become a circled 270°full arrow. On the left side, there will be several options under the name of this functionality:
In this area, when selecting one of the following buttons and clicking the mouse on the picture, it will rotate **all** of the layers a specific direction and degree, which will be made visible on the screen by displaying the rotated image. 
    - Button **rotate 90° left**
    - Button **rotate 180°**
    - Button **rotate 270° left** or **rotate 90° right**
- **Crop**
The cursor will become a rectangle with missing corners on the bottom left and top right.
Also on all of the corners and in the middle of all edges of the image, there will appear visible small circles.
All of these circles can be clicked on and moved in a certain direction while holding the left mouse button down.
The circles can't leave the borders of the image.
The circles in the corner can be dragged in all directions that go "inside the picture". The circles in the middle of the edges can be dragged on the (invisible) line connecting the circle with the other circle on the parallel edge.
The circles are connected with visible black lines between the corners and the middle points of the adjacent edges. For these lines the following applies: when moving a circle, the lines that were orthogonal to each other and the lines that were parallel to each other have to stay that way. That effectively means that when moving a "corner"-circle, the adjacent edges and their corners (including all circles on them) have to be moved with that circle without changing the direction.
After moving a circle to an allowed position, all the image information, which lies outside of the area of all the connecting lines, will be grayed out a little bit, so that the user knows which parts of the image will be lost when applying the cropping.

    The left border will now display a dropdown list, where the user can choose out of several ratios (e.g. 4:3) and a slider, where the user can slide the slider from 20-100 (the number will be displayed underneath the slider). Right of the slider and the dropdown list, there will be a button with the label "Move borders". This will move the circles in the same way as described above to specific locations.
    The selected ratio describes the desired width/height-ratio of the picture, which then should be inside the not grayed-out-area. The selected number from the slider describes, how much smaller the area should be made (with the selected ratio).
    There is a very important thing to address: 
     - It is possible for the ratio to be outside of the original ratio of the image. In this case, the area will be minimized until all of the new borders, which are out of bounds, will match the old ones (effectively losing even more information from the borders already inside the image).
     The percentage of minimizing will be compared against the percentage selected on the slider, and if smaller, substracted so that the difference can be still applied to the new borders.
    
    At the bottom there will be a button with the label "Apply". After clicking this, the parts that were grayed out will effectively be cut out of the image-data, after this we will display the cropped image. Before applying the cropping, but after clicking the button, the user will get a prompt telling them that cropped out data will be lost. They can choose to either confirm or abort the transformation.
    As always, there should be a maximum delay of 2 seconds and if this is not achievable, a bar displaying the progress of this operation.

- **Brush**
After selecting this functionality, the user is able to draw on the surface of the image.
The active layers will be the ones to which all drawings will be applied. That means, that for every layer a (for the user invisble) data structure (a original transparent layer of sorts, which stores the pixel information of the drawings) should be created. But this will be the content of other documents, since it's not really interesting for the user. It's just helpful for understanding what is actually going on.

    The brush selected will draw onto this data structure (or multiple of them, if there is more than one layer active) when the user is clicking onto a position on the picture. If this click happens and the mouse button is held down, the trace of the mouse will be observed, so that every position, where the mouse cursor is while holding down the mouse button will be saved as pixel information onto the corresponding data structure.
    The concrete data (color, thickness, ...) that will be saved will be customized on the left side of the screen.
    By default, the color is set to black (full alpha) and the thickness set to 8, which effectively means, that on every mouse position a circle with diameter 8 will be stored with an rgba value of (0,0,0,1).
    Note that the visible drawing layers will always be on top. The only way to achieve transparency is by setting the alpha value to a lower value.
    The mouse cursor will be a filled circle in the color of the selected brush and the thickness of the selected thickness from the left side. So by default, this should be a circle with the radius of 4 pixels and the color black.
    Let's take a look at the left border of the screen:
    - Right beneath the text ("Brush") there will be a scrollable bar with **presets**. We will define them in the next weeks. When clicking on one of the preset brushes, the information (stored in the following elements of the border) will be updated accordingly.
    - Beneath that there will be some **primitive forms** in such a scrollable bar. There the user can select a circle, a rectangle, a form which looks like a textmarker (a shifted rhombus), etc.
    The form of the cursor will be updated accordingly. Selecting one of these will change the way, surrounding pixels are (not) affected by drawing onto a position.
    - beneath that there will be a **slider** with a range from 1-100, with the selected number below and the description **Thickness**. When sliding the slider, the cursor should change it's appearance immediately to give the user direct feedback.
    - Underneath that slider, there will be a (circle formed) **palette**, which reacts to click of the user changing the color accordingly. Every RGB color has to be present in this circle. The cursor has to change immediately too.
    Underneath that color-picker circle the rgb values will be numerically displayed. On the right there will be a button with the label "pickAColor". The user can click this button and then click onto the image. The selected pixel-color-information will be applied to the brush. This is actually nothing different then picking the color from the palette.
    - Beneath that, there is a **slider** which goes from 0-100, which has the description **Alpha** above it and the numerical value beneath it. This maps to the alpha value of the rgba matrices to which the drawing information is written to. 0 means full transparancy (alpha 0) and 100 means full opacity (alpha 1.0).
    So, if the user for example picks the rectangle form with red color and thickness 4 with 50% transparancy, upon drawing the pixel on the mouse position will get the color information (255, 0, 0, 0.5) as well as the surrounding 2 pixels in every direction making up the rectangle.
    - Beneath that, there is a button with an **eraser** symbol. When selecting this, every pixel (and surrounding ones, depending on thickness and form) will be reset to (0, 0, 0, 0.0), so made transparent again.
    
- **Add Text** - user element
The cursor will become a capital letter ' I '. After clicking on a spot on the image, a dashed border will appear with its top left corner on the position, where the click occured. This border should be 1cm in the height and 4cm in the width, containing a blinking orthogonal line filling 80% of the length near the "start" of the border.
The user now is able to type in text. When typing something, the typed symbol should appear immediately, and the blinking line moves right behind it. When the blinking line gets out of bounds, the borders of the text field should increase in size, matching the line.
The user is able to press the "Enter-Key" or click with the mouse anywhere on the screen which is not the current text-box, which finalizes the typed in text which then later will be applied to the currently active layers.
The user is able to click somewhere inside the text box, which will move the blinking line to the position of the mouse cursor. When the user is typing now, every character will be set behind the line (as before), but the line will not only shift itself but all of its following characters to the right.
The user is able to press "Shift+Enter", which sets the blinking line (and all of it's following characters, if any) one textline under the current text line which also leads to moving the bottom border of the textfield exactly to 2*(size of one of the side borders) and increasing the size of the side borders accordingly.
On a technical note: Since we want to modifiy the text later on and not just applying it to the image, we have to save information about the text and its position in a sufficient data-structure. It should contain all of the added user elements with information about the position and onto which layers it should be applied to. This then will happen when choosing to save the image. We will concretize this in other documents, since it should not be too interesting for the user, who is just interested in selecting already existing text-fields (and other user-added elements) and editing them.

    The left area of the editor will contain the following functionality, from top to bottom:
    - A drop-down menu for selecting the font and right from that a drop-down menu for selecting the font-size.
    When changing the font size, the borders of the text field should change accordingly. The default font is *Arial* and the default fontsize *12* which should be consistent with the above described width/height properties.
    The changes apply only to the selected part of the text, or to all text in the field, if there is none selected.
    - A color palette in the same style of the the *brush*-functionality. *see above*
    - 3 buttons, labeled *Bold*, *Italy*, *Underline*, which either will apply the corresponding property to the *selected* text or if there is no text selected, apply it to all the text in the current text-box.
- **Mirror**
The cursor will become a shape and its mirrored counterpart with a line through the middle to indicate as such.
When clicking somewhere on the picture with this functionality active, all the active layers will be mirrored to an axis (which always goes through the center of the picture) which the user can select via buttons on the left side of the editor.
By default the y-axis is selected.
On the left area there are only 2 buttons which select the above described axis onto which active layers get mirrored:
    - **Y-Axis**
    - **X-Axis**

- **Undo and Redo**
Changes will be saved temporarily, so that if the user presses the **Undo** button the last change the user did will be removed. The **Redo** is the inverse of the **Undo** button, reversing whatever the **Undo** button undid. If the user made multiple changes, the user will able able to **Undo** multiple times and therefore also be able to press **Redo** multiple times afterwards. Making a change causes the redo history to be cleared. This means that if the user presses **Undo** and makes a change, **Redo** will now not be available.

## ADVANCED FEATURES NOT PART OF THE CORE

Now we will come to the more **hidden** features, which can be selected in the *menu*-dropdown in the top left.
This part will be more sophisticated and polished later in the work in progress, that this project is. For now we will give a more or less **rough outline** and will concentrate on implementing all the core functionality described above.
 
 - **Content aware scaling** (contrast comparison): The user will be given an option as to how much the image should be cropped. This process will remove the vertical paths with the lowest contrast. The result of this operation is that subjects in the image will be moved closer together similar to regular scaling. However, here the difference is that the "squishing together" of the important aspects of the image (like the subjects) is minimized, preserving as much detail in them as possible.

 - **Filters**: The user is presented with a menu giving them multiple filter options to choose from. When one of these filters is pressed it will either be applied directly if the filter has no real adjustment possibility (black and white for example) or a menu pops up presenting the user with options that change the intensity of the filter.

    - *Sharpen*: A menu pops up with a *slider* from 0 to 100. The higher the value, the more the contrast between pixels will be increased, given the appearance of a sharper image.

    - *Pencil Art*: The color information of the image will be changed to give the picture the appearance of a pencil-like texture, making it seem hand-drawn.

    - *Color Filters*: A variety of color filters will be added, which can be used to quickly change the color palette / hue / saturation of the given image. Examples of this would be restricting the color palette, to bring out green tones or changing the entire image to be in black and white.
    - ...

- **Rotating with values other than 90° and 180°**: The user is given the option to freely choose by how many degrees the rotate their image. This is similar to the rotation option described earlier, but the option to change the exact rotation angle in real time is slightly more advanced. It is similar to the rotation option describes *above*.
**comment from nico: it is actually not tho. The difference is, that, when we rotate around 90° or its multiples, that we easily can adjust the dimension of the picture, which always is a rectangle.**
**When we do not rotate around 90° multiples, we have to add "empty" pixel information around the not rectangle picture now - or some other solution solving this**

- **Smart Select Tool**: The cursor will become the shape of **TODO**. After roughly selecting an object, the program will correct the selection to snugly select the object inside to the ebst of its ability. When the selection is made, everything will be the same as a selection done by the regular select tool, as described *above*. This means the selection will be slightly darker to indicate where the selection begins and ends and you will be able to easily cut, copy, move, or delete the selection.

- **Compression**: After having the user selected the "PNG compressed" action (in the download menue), the program will compress the given image and try to make the file size as small as possible and download it, whilst retaining as much information as possible

- **Object Removal**: After selecting an object the user can choose the object removal option. The program will try to remove the selected object and fill the gap with a content-aware background, making it seem as though the object has simply been removed from the picture.
    
- And so on, and so forth ...

## Software quality concerns
When taking a look at software quality, the ISO 25000 Standards need to be taken into consideration, namely **Usability**, **Performance Efficiency**, **Reliability**, **Functional Suitability**, **Compability**, **Security**, **Portability**, and **Maintainability**.

### Usability

Usability has a high priority in this project. Ideally, the application should be self-explanatory to all future users and also accessible to all users.

In order to ensure a flat learning curve, all editing functions should display a short description of their effect upon hovering over them. User input fields should have clear and comprehensible labeling.

To help users with visual impairments, such as reduced eyesight or colorblindness, all text and symbols in this application should be on a high contrast background. Messages and feedback for the user should not rely on color, meaning there should always be additional text explaining a success or an error, rather than just showing something in green or red.

In case any type of unexpected error occurs within the application, the error message shown to the user should be comprehensible. If the error occurs on the users side, i.e. accidentally altering the image, the user will be able to undo their last alterations.

Aesthetically, buttons, labels and headings on the same level, i.e. within the same "box" later referred to as borders, should look the same and therefore promote an orderly overview. 

### Performance Efficiency
Regarding Performance Efficiency, the editor should perform all common operations we're planning to implement, for example cropping or brush tools, quickly. The user will expect real-time feedback as they try to make changes to their image. In case of algorithmically intense operations, which cannot be completed (almost) instantly, a progress bar will be shown, so that the user receives feedback that their changes are in progress to reduce confusion. The programm will be mindful of resource usage, so that simple operations don't use up an unneccesary amount of memory or CPU power. For example, choosing the correct data structure to efficiently carry out a task.
Proper error handling and meaningful error messages in the case of unexpected issues, will enhance ease of use and eliminate user frustration as much as possible (further outlined in the section regarding Reliability) All this, along with a responsive UI, will allow for a smooth and performant user experience.
When it comes to operations and algorithms, efficient image processing algorithms and suitable data structures (for example processing pictures in a consistent way even across file types) will be implemented for further optimization.

### Reliability
As we develop the image editing program, adherence to ISO/IEC 25000 series (SQuaRE) standards for reliability is a priority. The following outlines our planned strategies to ensure reliability throughout the software's lifecycle:

To achieve a **mature product**, our development process will include a robust testing regimen consisting of unit tests for low-level code verification and comprehensive user testing to ensure that the functionality meets the practical needs of end-users. Our goal is to minimize the defect rate to a target that is well below the accepted threshold for image editing applications, which will be determined as we progress in the development.

The image editing program will be engineered with advanced **fault tolerance** mechanisms. Exception handling routines will be integrated throughout the software to handle operational anomalies without disrupting user workflow. This design strategy will be subjected to rigorous fault injection testing to ensure that it is capable of maintaining operational continuity in the face of system-level errors.

A key feature for our users will be a robust ‘undo/redo’ (see above) functionality, which will allow them to recover from mistakes or experiment with different editing options. This feature will support **recovery of multiple steps**, with the exact number being finalized based on user needs and technical feasibility assessments.

### Functional Suitability
**Functional Completeness**: I need to ensure that my app offers a
comprehensive set of image editing functions to meet the diverse needs of users. It should cover a wide range of editing features to address various editing scenarios.

**Correctness**: It's essential that the applications editing functions work accurately and produce the expected results. There should be minimal room for errors or unexpected behavior in the editing process. This will be ensured through unit and developer testing.

**Appropriateness**: The applications editing features should be appropriate for the intended user base and use cases. It's important to align the functionality with the specific needs and preferences of the target audience we outline in the user stories.

**Supported Image Editing Features**: The application need to offer all the necessary image editing features that users expect, including cropping, rotation, filters, retouching and all other editing tools listed in our Analysis.

**Performance**: The application should be capable of processing images quickly and efficiently, especially when handling complex editing tasks.

**Stability**: The application needs to be stable and should not crash or exhibit unexpected behavior while users are editing images.

**Reliability**: I must ensure that all edited images are reliably saved and displayed without any quality loss or errors. Any system errors like missing permissions or storage space will not cause issues with the program.

**Supported File Formats**: The application should support a wide range of image formats to enable users to easily import and export their images.


### Compatibility
- The aplication runs in a web browser, so OS compatibility is handled there and is optimized for every OS

#### co-existence
- The applications performance will of course vary depending on the hardware
- the total bandwidth and speed to upload a picture is limited by the server hardware and routing. Upload is only efficent until hardware limitations of the server is reached. (when run locally, the upload speed is limited by drive speed, processor and ram from the local system)
- every layer is on its own, the number of layers that can co-exist is determined by hardware limitation
- when an instance is closed all the system resources get freed and can be used in a new process that allready exist
- only one selection can co-exist
- multiple textfields can exist at once
- multiple effects can co exist on one layer

#### Interoperability
- different users should not be able to edit the same session of a picture so there is no exchange between sessions at all
- User have different sessions so there is no interference when uploading a picture
limitation
- parts of layers can be pasted to other layers 
- the picture that was saved can be used in a new process
- selected text can be copied and pasted to another textfield
- specific effect settings can be copied to another layer/object


### Security
**Confidentiality**: Data granted by the user to the program, including personal information and created images, will never be shared or published by the program anywhere else. The user is ensured a closed-off secure editing environment in which they can employ personal, commercial or private photos, designs, information and etc., without running the risk of this information then being exposed. If a session is closed due to the computer powering off, or the tab being closed, or etc., all the information accessible from the user's side will be wiped from that session. If the user wishes to share or save the image, they are able to do so, but this will solely happen by their own decision, and the program will not release any information regarding who shared an image, with whom an image was shared, or who saved an image. And of course, the user can at any time choose to delete any and all files they have uploaded to the program, and they will all get completely wiped.

**Integrity**: Integrity is crucial for our program in how it relates to preserving the original quality of images uploaded by the user and not having them be tampered with. This will manifest itself in many ways. Images being uploaded will be encrypted so that they do not get possibly tampered with in transit. Once the image(s) is/are uploaded, the program will never make any changes to the images that the user is not informed about - e.g. images will not be compressed without the user themselves employing this functionality, image formats, dimensions and quality will all be preserved (if a format, dimension or resolution cannot be accepted by the program, the user will be notified about this, instead of the program covertly tampering with the file so that it can be uploaded). Moreover, during the editing process, all tools and functions of the program will work exactly as they are defined/presented - a tool will not do something one doesn't expect of it - and if mistakes are made, the 'undo'/'redo' buttons allow for the integrity of the image and data to be preserved.

**Non-repudiation & Accountability**: The platform should generally be secured against all kinds of suspicious and harmful activity. Though this is question of general web application security, not something specific regarding our application. 

### Portability
Portability really isn't a thing we need to adress in too much detail, since we have an application that is accessible from any modern browser from any device. There won't be any installation process, the only thing the user has to do is type in the URL in the browser to start processing images. We will test the portability by calling the URL from many different devices (not Smartphones for now) with different browsers and OS.
The portability to smartphones won't really be a thing we will concentrate on for now. On the other hand, all the design elements will be implemented via ratios, not absolute sizes. So technically it will be possible, to use the application from a smartphone.
But since the (many) features of the editor will be rather complex (which will be easier to use with a mouse), the user doesn't really have the desire to use the application on smartphones - tablets on the other hand could be an option, especially when using them with a tablet-pen.
We will combine the following OS and Browser and on all the combinations the application should work (all the devices are assumed to have at least 1GB of usable RAM):

Windows 11 - Opera 104.0.4944.36, Opera GX 102.0.4880.90, Edge 119.0.2151.44, Chrome 119.0.6045.109, Firefox 119.0, IE 11.1198.18362.0
Ubuntu 20.04 LTS - Opera 104.0.4944.36, Opera GX 102.0.4880.90, Chromium 119.0.6045.59, Chrome 119.0.6045.109, Firefox 119.0
Linux Mint 21.2 - Opera 104.0.4944.36, Opera GX 102.0.4880.90, Chromium 119.0.6045.59, Chrome 119.0.6045.109, Firefox 119.0
Linux Fedora 38 -  Opera 104.0.4944.36, Opera GX 102.0.4880.90, Chromium 119.0.6045.59, Chrome 119.0.6045.109, Firefox 119.0
Mac OS Ventura -  Opera 104.0.4944.36, Opera GX 102.0.4880.90, Safari 17.0, Chrome 119.0.6045.109, Firefox 119.0, IE 11.1198.18362.0
On all of these combinations the application will:

(a) have the same relative ratio to the resolution ratio of all UI-Elements on different monitor resolutions: 720p, 1080p, 1440p, 1280x1024, 1366x768 and 2560x1600


(b) will offer the same working functionality with extra focus on OS Syscalls or Browser specific calls that need to be made:

Calling the URL and get a result
uploading files
downloading files
display RGBA-matrices (decoded pictures) on the screen

...
Effectivly this means, that all the later specified tests will have to succeed on all the combinations (OS x Browser x Resolution) above. The main focus of the development will be the experience on a computer.

### Maintainability
Regarding maintaibility we will adhere to coding standards with an emphasis on readibility and documentation of the funcitonality of the code. Through splitting our code into multiple components to the best of our ability, we will try to make the code as simple to maintain and service as possible.

## Developer "Plichtenheft"
In this part of this document, we will specify certain metrics derived from the user stories and use cases above . They will be the base for implementing tests that ensure the quality of this software. 
All the tests will be carried out on the different combinations of Operating Systems and Browsers above. If we seem it neccessary to also combine them with the above described different resolutions, we will mark this section by writing a **--res--** after its title.
If we talk about "certain" elements and aren't very specific about them, we will have them listed in a different document.
For example: some tests will be about *all* UI-Elements. Since they aren't all known for now and also will probably take up some space in naming them, it makes sense to have a reference document for all the UI-Elements.

- *Usablility/Portability* Testing all UI-Elemnt Ratios **--res--**
    All the different UI-Elements (Buttons, Areas, ...) shall be
    (a) accessibly
    (b) in the same ratio
    on all the different resolutions. We will confirm that by simply measuring it. If we find a tool, which can do the ***measuring*** part for us, we will use that.
- *Usability* Testing intuition of all Buttons (and other interactable UI-Elements)
    The user should be able to "guess", what a button does, without having a description. We will measure this, by simply just asking 10 test-user, if they are able to decifer, what a button does, without showing them the tooltips (case **A**) and then showing them the tooltips (case **B**). They can in both cases:
    (1) understand it completly
    (2) nearly understand it
    (3) "have some guesses", but don't really understand it
    (4) dont understand it
    The total score of one button per user will be calculated as follows: **(2A) + B**. We then will take the average of all the scores per button. If a button maps to a **score <= 7**, the test will succeed.
    Obviously, a score of **3** is *desirable*, so we will take input from all the testers, which gave a higher score, and will analyze it internally.


# Edit
#### Row 193
- Original:
    -**Compression**: After having the user confirm their action, the program will compress the given image and try to make the file size as small as possible, whilst retaining as much information as possible
- This paragraph was modified to better clarifie the compression processs
#### Row 59 
- Original: To make this work, we have to convert all the matrices containing color information into the selected image-file type. This should not take longer than 2 seconds.
- add filetype list that is supported with the download
