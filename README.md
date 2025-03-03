https://github.com/user-attachments/assets/6335ac50-3cd8-43f6-aa76-da76d970fc3e

## Desc

An interactive 3D experience built using React Three Fiber (R3F) and Three.js. The project showcases dynamic animations, smooth transitions, and responsive layouts optimized for various screen sizes.

## Initial problem

When manipulating hundreds of objects in 3D space, libraries (eg GSAP, React-Spring) create long tasks up to 1000 ms. I solved the issue by using native Three.js methods, reserving spring animations for smaller tasks. This reduced performance bottlenecks and ensured smooth, responsive interactions.

## Features

- Navigate 3d gallery
- Multiple sorting algorithms with lerp animations
- Drag & Drop elements
- Hires images available by clicking
- Upload images via authorized admin panel

## Tech (Client)

- React
- TypeScript
- Three.js
- React Three Fiber (R3F)
- React-Spring
- Mobx
- Axios

## Tech (API)

- Express
- JWT
- Multer
- Sharp
- Stored in separate repository: [link](https://github.com/petrlipatov/3d-gallery-server)

[Link to the application](https://stepanplusdrawingultra.site/)
