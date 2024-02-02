# Anforderungsanalyse

## Use cases

#### Basic Editor Features

- A user wants to upload an image to the site. 
- A user wants to rotate an image by 90 degrees.
- A user wants to compress an image to decrease its file size, while keeping the quality similar.
- A user wants to draw notes onto an image, using varying colors, a pencil and a highlighter. If they mess up, they want to be able to erase what they drew.
- A user wants to add text to their picture.
- A user wants to mirror their picture on either the x or y axis, so that they have an inverted/upside-down picture afterwards 
- A user wants to select a small part of their uploaded image to either copy or delete it
- A user wants to add a background to their transparent picture by adding a background layer
- A user wants the editor to save the changes they have done in this session, so they can quickly undo any change

#### Advanced Features
- A user wants to be able to crop their image.
- A user wants to be able to use content-aware scaling to change their image, meaning that they can move decrease the width of their image and move subjects closer to each other, whilst "squishing" them together as little as possible.
- A user wants to sharpen their image, by increasing the contrast.
- A user wants to tilt their image slightly on the x and y axis, resulting in a the image having the appearance of a different angle.
- A user wants to change the color pallete or look of their image via filters or other hue/saturation changes.
- A user wants to be able to use a smart select tool that selects an entire object, by roughly drawing an outline around said image
- A user wants to remove a selected object from the image and let the editor fill in the removed area in a content-aware style, so that the colors match the rest of the background

# User stories
Note: Completess criteria, that are already mentioned in other user stories are not mentioned twice. For example the ability to upload an image is only mentioned in the first, even though it is technically required for every feature

- As a user of the image editing app, I want to upload and edit a photo I took during my vacation and save it after I'm done, so that I can enhance and customize it before sharing it with my friends.
	- Completeness criteria: 
		- I should be able able to upload an image
		- I can only select valid image types
		- I can freely make changes
		- I can save the changes and save the image to my device
	- Time required / estimated effort:
		- TODO

- As a social media user, I want to rotate my horizontal picture by 90 degrees, so that I can upload it in a vertical format.
	- Completeness criteria: 
		- I can rotate an uploaded image clockwise or counter-clockwise by 90 degrees
		- The resulting image should have no loss in quality and should not be distorted
	- Time required / estimated effort:
		- TODO

- As a user with limited storage space, I want to be able to compress my pictures to lower their file size so that I can keep them on my phone.
	- Completeness criteria: 
		- I am able to access the compression option
		- I can compress picture to lower file size
		- The compression retains as much information as possible (Acceptable cut-off needs to be discussed / perhaps user can choose quality setting)
	- Time required / estimated effort:
		- TODO

- As an annotator, I want to write onto my images in different colors and thicknesses using a pencil-like tool, as well as adding text onto my image, so that I can add different kinds of notes to my picture.
	- Completeness criteria: 
		- I can choose pencil/brush tool
		- I can draw on the picture
		- I can change the color of the tool
		- I can change the thickness of the tool
		- I can select the text editing tool
		- I can change the font
		- I can change the font size
		- I can add text to the image
	- Time required / estimated effort:
		- TODO

- As a user, I want to mirror my picture on the y-axis, so that I can easily read the inverted text I took a picture of.
	- Completeness criteria: 
		- I want to be able to select the mirroring option and mirror my image on the y-axis, creating an inverted/mirrored version
		- The mirrored image should maintain high quality and clarity, even with mirroring effects applied
	- Time required / estimated effort:
		- TODO

- As a visual artist, I want to mirror my picture on the x-axis, so that I can play with the perspective of my images.
	- Completeness criteria: 
		- I want to be able to select the mirroring option and mirror my image on the x-axis, creating an upside-down version
		- The mirrored image should maintain high quality and clarity, even with mirroring effects applied
	- Time required / estimated effort:
		- TODO

- As a casual photographer, I want to be able to select a part of an image, so that I can not only freely edit only this part of the image, but also be able to copy, cut, delete, or move only this part of the image.
	- Completeness criteria: 
		- I can make a rectangular selection
		- I should be able to easily tell visually what I have selected
		- I can freely choose the size of this selection my holding down my mouse-button and dragging until I reach my desired size
		- Once I have a selection, I should only be able to edit inside this selection
		- When I press delete or move the selection, only the selection should be affected
		- If I copy or cut the selection, only the selection should be copied to my clipboard
	-  Time required / estimated effort:
		- TODO

- As a casual photography editor, I want to be able use multiple layers in my picture editing process, so that I can add a PNG picture with a transparent background on top of my personal background. 
	- Completeness criteria: 
		- I want to be able to create a new layer that lies on top of or under my image
		- I want to be able to freely select a layer I want to work on
		- I want to change the order of the layers
		- I want to see all the layers I have
		- If an image is on a higher layer it should always be above the ones below
		- I should be able to select, move, scale, and rotate objects within each layer
		- I should be able to merge layers
		- I should be able to delete layers
	- Time required / estimated effort:
		- TODO

- As a meticulous editor, I want to be able to quickly undo any change I have made, as well as redo any options I have undone, so that I can easily jump back and choose a different option.
	- Completeness criteria:
		- The editor should save a "editing history" for the current session
		- When I press undo the last edit I added should be undone
		- I can press undo multiple times
		- When there is nothing to undo, the button should do nothing
		- When I press redo the last edit I undid should be redone
		- I can press redo multiple times
		- When there is nothing to redo, the button should do nothing
	- Time required / estimated effort:
		- TODO

- As a social media user, I want to be able to crop out a 1:1 square out of my image, so that I can easily upload this as my profile picture on a social media site.
	- Completeness criteria:
		- I should be able to choose crop tool
		- I want to freely crop the image into a desired rectangular shape
	- Time required / estimated effort:
		- TODO

- As a tech-savvy photographer, I want to move two historical structures in my image closer together without distorting them by removing the space between them via a content-aware tool, so that I can get an image of them next to each other.
	- Completeness criteria:
		- I want to be able to choose a content-aware / contrast aware scaling option
		- I want to choose how much my image should be cropped / scale horizontally
		- In the resulting image, the main subjects should be moved closer together
		- The subjects should be affected minimally
	- Time required / estimated effort:
		- TODO

- As a casual photographer, I want to sharpen my image by changing the contrast, so that I decrease the graininess of my picture.
	- Completeness criteria:
		- I want to be able to choose the sharpening option
		- I should be able to choose the level of sharpening
		- The resulting images neighboring pixels should have their contrast increased to give the appearance of a sharper image
	- Time required / estimated effort:
		- TODO

- As a landscape photographer, I want to be able to freely adjust the color levels of my image, so that I can make certain colors pop out.
	- Completeness criteria:
		- I want a multitude of color adjustment options (Hue, Saturation, Filters, ...)
		- After selecting hue, I want to change the hue levels of the different colors freely through a slider
		- After selecting saturation, I want to be able to increase or decrease the color saturation of the image through a slider
		- After selecting the filter option, I want to be able to browse the available filters
		- When I select a filter, if available, I want to be able to choose its intensity
		- If not available or after the intensity is set, I want to be able to apply the filter
	- Time required / estimated effort:
		- TODO
	
- As a user of the app, I want to be able to loosely draw a selection around an object and let the editor select the object automatically, I then want to be able to remove the object using a content-aware fill option, so that there is no empty gap left behind after the removal.
	- Completeness criteria:
		- I want to be able to choose the smart selection tool
		- If I draw around an object, the editor will adjust the selection to fit snugly around the object
		- After the object is selected, it should have the same properties as a normal selection (Being able to see that it is selected, only being able to affect the selection, ...)
		- When an object is selected, I want to be able to choose the object removal option
		- The object removal option should delete the selected image an fill the emptiness with what the editor thinks should be there (content-aware, comparing with the rest of the background)
	- Time required / estimated effort:
		- TODO