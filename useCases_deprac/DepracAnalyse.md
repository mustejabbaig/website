# Anforderungsanalyse

## Introduction
This webapplication should enable the user to easily upload pictures from their harddrive, edit and subsequently download them, using a Browser of their choice.

This document will include the applications requirements from the **users** perspective and the requirements and testing conditions from our, the **developers**, point of view. 

## Use Cases 
//"Basic features"
- A user wants to upload an image to the site
- A user wants to rotate an image by 90 degrees
- A user wants to compress an image to decrease its file size
- A user wants to draw notes onto an image, using varying colors, a pencil and a highlighter. If they mess up, they want to be able to erase what they drew.
- A user wants to add text to their picture
- A user wants to mirror their picture
- A user wants to select a small part of their uploaded image to either copy or delete it
- A user wants to add a background to their transparent picture by adding a background layer
- A user wants to be able to undo any accidental changes

//"Algorithmically complex features"
- A user wants to be able to crop their image
- A user wants to be able to use content-aware scaling to change their image
- A user wants to sharpen their image
- A user wants to angle their image differently
- A user wants to change the color pallete or look of their image via filters or other hue/saturation changes
- A user wants to be able to use a smart select tool that selects an entire object
- A user wants to remove an object from the image

## User perspective
### General
The application should be accessible via its webaddress using any Browser and all common devices, such as laptops, PCs and mobile phones.

If possible, any proccessing and loading should take less than two seconds or otherwise display a progress bar.

In case of an error, the user should receive a comprehensible error message and instructions on how to avoid or fix said error.

### Starting page

The user should be welcomed by a simple and modern interface with a written introduction to the application in the center and a clickable button below, prompting the user to upload **one** HTML5-File from their harddrive, using the operating systems **file structure (TODO:rewording needed)**.

Ideally, the user should only be able to select one of the following image types [png, apng, aviv, bmp, jpg/jpeg, gif].
In case the chosen file is a valid image type, the user will be directed to the next page, from here on referred to as the **Editor**, otherwise the user will be shown an error message and a prompt to try again.

**TODO: specify interface design, any additions? **

### Editor
The Editor should display the uploaded image in the right bottom corner, filling out about 75% of the screen, with evenly distributed borders and update the display according to the current stage of editing. 

It should provide an intuitive and accessible interface, by displaying a toolbar at the top, containing the basic features further specified in the Use Cases further down, and a drop down menu with the more complex features, also specified in the Use Cases.

By hovering over a specific feature, the feature should be highlighted and the user should be shown a short description for the feature.
Upon choosing a feature, a toolbar containing all needed input prompts should appear on the left border space. The input should preferably be made via Sliders and Buttons, rather than typing an input.

In case of multiple Layers, a toolbar displaying the seperate Layers should appear on the right side, moving the image display to the center. It should enable the user to change the layers order by using drag-and-drop and to individually hide certain layers.

The functionalities and their specifics shown in the top bar are the following, with the contents of the left border toolbar described in the underpoints.
Also we describe the description that the user gets via hovering on the features:
**//TODO: Change the order?**
**//TODO: describe functionality in more detail**
1. Select Tool
    * Select via Rectangle
    * Select via Free Hand
    * Select element (from other functionality-elements used by the User)
2. Crop Tool -Dot Points will appear on the 4 corners of the image, allowing the user to shift these around to dynamically crop
    * select from different ratios for static cropping
3. 

**//TO BE Continued**

## Developer "Plichtenheft"
Here we will specify and formalize all of the wishes of the user(s) described above, so that we can properly implement and test all the desired features and Designideas.
