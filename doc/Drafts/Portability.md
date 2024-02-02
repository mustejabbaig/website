### General
The application should be accessible via its webaddress using any browser and all common devices, such as laptops and PCs.

If possible, any proccessing and loading should take less than two seconds or otherwise display a progress bar.

In case of an error, the user should receive a comprehensible error message and instructions on how to avoid or fix said error.

// THE FOLLOWING STUFF WILL BE ADDED - - - 

We also will adress certain quality requirements according to *ISO 25'000*, namely **Functional Suitability**, **Performance Efficiency**, **Compability**, **Usability**, **Reliability**, **Security**, **Maintainability** and **Portability**.

**Portability** really isn't a thing we need to adress in *too* much detail, since we have an application that is accessible from any modern browser from any device. There won't be any installation process, the only thing the user has to do is type in the URL in the browser to start processing images. We will test the portability by calling the URL from many different devices (not Smartphones for now) with different browsers and OS. 
The portability to smartphones won't really be a thing we will concentrate on **for now**. On the other hand, all the design elements will be implemented via ratios, not absolute sizes. So technically it will be possible, to use the application from a smartphone.
But since the (many) features of the editor will be rather complex (which will be easier to use with a mouse), the user doesn't really have the desire to use the application on smartphones - tablets on the other hand could be an option, especially when using them with a tablet-pen.
We will combine the following OS and Browser and on all the combinations the application should work (all the devices are assumed to have at least 1GB of usable RAM):
- Windows 11 - Opera 104.0.4944.36, Opera GX 102.0.4880.90, Edge 119.0.2151.44, Chrome 119.0.6045.109, Firefox 119.0, IE 11.1198.18362.0
- Ubuntu 20.04 LTS - Opera 104.0.4944.36, Opera GX 102.0.4880.90, Chromium 119.0.6045.59, Chrome 119.0.6045.109, Firefox 119.0, IE 11.1198.18362.0
- Linux Mint 21.2 - Opera 104.0.4944.36, Opera GX 102.0.4880.90, Chromium 119.0.6045.59, Chrome 119.0.6045.109, Firefox 119.0, IE 11.1198.18362.0
- Linux Fedora 38 -  Opera 104.0.4944.36, Opera GX 102.0.4880.90, Chromium 119.0.6045.59, Chrome 119.0.6045.109, Firefox 119.0, IE 11.1198.18362.0
- Mac OS Ventura -  Opera 104.0.4944.36, Opera GX 102.0.4880.90, Safari 17.0, Chrome 119.0.6045.109, Firefox 119.0, IE 11.1198.18362.0
On all of these combinations the application will:
- **(a)** have the same relative ratio to the resolution ratio of all UI-Elements on different monitor resolutions: *720p*, *1080p*, *1440p*, *1280x1024*, *1366x768* and *2560x1600*
- **(b)** will offer the same *working* functionality with extra focus on OS Syscalls or Browser specific calls that need to be made:
    - Calling the URL and get a result
    - uploading files
    - downloading files
    - display RGBA-matrices (decoded pictures) on the screen
    - **...**
Effectivly this means, that all the later specified tests will have to succeed on all the combinations (OS x Browser x Resolution) above.
