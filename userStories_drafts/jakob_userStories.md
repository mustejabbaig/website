# User Stories

## User Story: Uploading an Image to the Site

**Title**: As a user, I want to upload an image to the site.

**Narrative**:
- **As** a user
- **I want** to upload an image to the site,
- **so that** I can edit it using the provided tools.

**Acceptance Criteria**:
- **Given** I am on the image editing site,
  **when** I upload an image file,
  **then** the site should accept and display the image for editing.

**Estimated Time**
1 hour

## User Story: Intuitive Image Upload Interface

**Title**: As a user, I want an intuitive and efficient way to upload images to the site.

**Narrative**:
- **As** a user,
- **I want** to easily upload images to the site via an intuitive interface,
- **So that** I can quickly proceed to editing them.

**Acceptance Criteria**:
- **Given** I am at the starting page of the site,
  **when** I interact with the upload button,
  **then** I should be able to upload images either by clicking the button to open the file chooser or by dragging and dropping images onto the button.
- **And** the upload button should be visibly distinctive (e.g., red with gradient).
- **And** only image files should be accepted for upload.
- **And** upon successful upload, I should be redirected to the editor page within 2 seconds.
- **And** if I attempt to upload a non-image file, I should receive an error message and have the opportunity to try uploading again.
This user story addresses the user's need for an intuitive upload process, the appearance of the upload button, and the expected behavior when interacting with it, including error handling.

**Estimated Time**
5 hour

## User Story: Uploading, Editing, and Downloading an Image

**Title**: As a user, I want to upload and edit a photo from my vacation and save it after I'm done.

**Narrative**:
- **As** a user,
- **I want** to upload a photo, edit it, and then download the edited version,
- **So that** I can enhance and customize it before sharing it with my friends.

**Acceptance Criteria**:
- **Given** I am on the starting page of the image editing app,
- **When** I upload a photo,
- **Then** I should be able to select only valid image types and be presented with editing tools.
- **And** after editing, I should be able to save the edited photo to my device.

**Estimated Time**
- 5 hours

## User Story: Introduction to the Application

**Title**: As a user, I want a starting page that introduces me to the application.

**Narrative**:
- **As** a user,
- **I want** a starting page with a clear introduction,
- **So that** I can understand what the app is about and how to use it.

**Acceptance Criteria**:
- **Given** I navigate to the URL of the image editing app,
- **When** the starting page loads,
- **Then** I should see a welcoming interface with an introduction to the application features and how to use them.

**Estimated Time**
- 3 hours

## User Story: Rotating an Image

**Title**: As a user, I want to rotate an image by 90 degrees.

**Narrative**:
- **As** a user
- **I want** to rotate an image by 90 degrees,
- **so that** I can orient it correctly.

**Acceptance Criteria**:
- **Given** I have an image uploaded,
  **when** I select the option to rotate the image,
  **then** the image should rotate 90 degrees clockwise or counterclockwise.

**Estimated Time**
- 1 hours

## User Story: Compressing an Image

**Title**: As a user, I want to compress an image to decrease its file size.

**Narrative**:
- **As** a user
- **I want** to compress an image,
- **so that** I can save space or make the image easier to share.

**Acceptance Criteria**:
- **Given** I have an image uploaded,
  **when** I select the option to compress the image,
  **then** the image should be compressed, reducing its file size without significantly reducing quality.

**Estimated Time**
10 hours

## User Story: Drawing Notes on an Image

**Title**: As a user, I want to draw notes onto an image with various tools.

**Narrative**:
- **As** a user
- **I want** to draw notes onto an image using a pencil and highlighter in varying colors,
- **so that** I can annotate and emphasize parts of the image.

**Acceptance Criteria**:
- **Given** I have an image uploaded,
  **when** I use the drawing tools on the image,
  **then** I should be able to draw with a pencil or highlighter and choose different colors.
- **Given** I have drawn on the image,
  **when** I make a mistake,
  **then** I should be able to use an eraser to correct it.

**Estimated Time**
15 hours

## User Story: Adding Text to an Image

**Title**: As a user, I want to add text to my picture.

**Narrative**:
- **As** a user
- **I want** to add text to my picture,
- **so that** I can include captions or labels.

**Acceptance Criteria**:
- **Given** I have an image uploaded,
  **when** I select the text tool and click on the image,
  **then** I should be able to type and format text on the image.

**Estimated Time**
5 hours

## User Story: Mirroring an Image

**Title**: As a user, I want to mirror my picture.

**Narrative**:
- **As** a user
- **I want** to mirror my picture,
- **so that** I can create symmetrical effects or reverse the image layout.

**Acceptance Criteria**:
- **Given** I have an image uploaded,
  **when** I select the option to mirror the image,
  **then** the image should be flipped along the chosen axis.

## User Story: Selecting Part of an Image

**Title**: As a user, I want to select a small part of my uploaded image to copy or delete it.

**Narrative**:
- **As** a user
- **I want** to select a part of my image,
- **so that** I can copy or remove specific sections.

**Acceptance Criteria**:
- **Given** I have an image uploaded,
  **when** I use the selection tool on the image,
  **then** I should be able to choose a rectangular or free-form area to copy or delete.

**Estimated Time**
10 hours

## User Story: Adding a Background to a Transparent Image

**Title**: As a user, I want to add a background to my transparent picture.

**Narrative**:
- **As** a user
- **I want** to add a background layer to my transparent image,
- **so that** I can enhance the visual appeal or prepare it for certain uses.

**Acceptance Criteria**:
- **Given** I have a transparent image uploaded,
  **when** I add a background layer,
  **then** the transparent parts of the image should display the chosen background.

**Estimated Time**
15 hour

## User Story: Undoing Accidental Changes

**Title**: As a user, I want to be able to undo any accidental changes.

**Narrative**:
- **As** a user
- **I want** to undo accidental changes,
- **so that** I can revert mistakes and continue editing without stress.

**Acceptance Criteria**:
- **Given** I have made changes to the image,
  **when** I click the undo button,
  **then** the last change should be reverted.

**Estimated Time**
5 hour

# Algorithmically Complex Features

## User Story: Cropping an Image

**Title**: As a user, I want to be able to crop my image.

**Narrative**:
- **As** a user
- **I want** to crop my image,
- **so that** I can focus on a specific area or remove unwanted parts.

**Acceptance Criteria**:
- **Given** I have an image uploaded,
  **when** I select the crop tool and choose an area,
  **then** the image should be cropped to the selected area.

**Estimated Time**
5 hour

## User Story: Using Content-Aware Scaling

**Title**: As a user, I want to use content-aware scaling to change my image.

**Narrative**:
- **As** a user
- **I want** to use content-aware scaling,
- **so that** I can resize my image without distorting important content.

**Acceptance Criteria**:
- **Given** I have an image uploaded,
  **when** I select the content-aware scaling option,
  **then** the image should be scaled intelligently, preserving the visual integrity of the content.

**Estimated Time**
30 hour

## User Story: Sharpening an Image

**Title**: As a user, I want to sharpen my image.

**Narrative**:
- **As** a user
- **I want** to sharpen my image,
- **so that** I can enhance its clarity and detail.

**Acceptance Criteria**:
- **Given** I have an image uploaded,
  **when** I select the sharpen tool,
  **then** the image should appear clearer with enhanced details.

**Estimated Time**
30 hour

## User Story: Angling an Image Differently

**Title**: As a user, I want to angle my image differently.

**Narrative**:
- **As** a user
- **I want** to angle my image,
- **so that** I can correct its perspective or create a dynamic composition.

**Acceptance Criteria**:
- **Given** I have an image uploaded,
  **when** I select the option to change the image angle,
  **then** the image should be reoriented to the chosen angle.

**Estimated Time**
20 hour

## User Story: Changing Image Color Palette

**Title**: As a user, I want to change the color palette or look of my image.

**Narrative**:
- **As** a user
- **I want** to apply filters or adjust hue/saturation,
- **so that** I can change the mood or correct the color balance of my image.

**Acceptance Criteria**:
- **Given** I have an image uploaded,
  **when** I apply a filter or adjust the color settings,
  **then** the image should reflect the changes, altering its overall palette.

**Estimated Time**
30 hour

## User Story: Using Smart Select Tool

**Title**: As a user, I want to be able to use a smart select tool that selects an entire object.

**Narrative**:
- **As** a user
- **I want** to use a smart select tool,
- **so that** I can easily select complex shapes or objects without manual tracing.

**Acceptance Criteria**:
- **Given** I have an image uploaded,
  **when** I use the smart select tool,
  **then** it should automatically detect and select the entire object within my image.

**Estimated Time**
40 hour

## User Story: Removing an Object from the Image

**Title**: As a user, I want to remove an object from the image.

**Narrative**:
- **As** a user
- **I want** to remove objects from my image,
- **so that** I can clean up distractions or unwanted elements.

**Acceptance Criteria**:
- **Given** I have an image uploaded and an object selected,
  **when** I choose to remove that object,
  **then** the object should be removed and the area should be filled in a way that blends with the surrounding image.
  **

**Estimated Time**
50 hour