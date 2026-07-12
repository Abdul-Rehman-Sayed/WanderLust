# WanderLust 
A travel accommodation platform where users can explore, post, and review stays with integrated mapping and cloud media management.

### Key Technical Highlights
* **Automated Geocoding:** Intercepts text addresses to query the Mapbox Geocoding API, extracting GeoJSON coordinates for interactive map pins.
* **Cloud Media Pipeline:** Integrated Multer and Cloudinary for seamless image uploads with on-the-fly URL transformations for optimized thumbnail delivery.
* **MVC Architecture:** Cleanly decoupled routing, database schemas, and request handlers to ensure a maintainable and scalable codebase.
* **Referential Integrity:** Implemented Mongoose post-hooks to handle cascading deletions, ensuring orphaned reviews are purged when a listing is removed.

### Tech Stack
* **Frontend:** HTML, CSS, Bootstrap, EJS
* **Backend:** Node.js, ExpressJS 
* **Database:** MongoDB 
* **Services:** Mapbox API, Cloudinary 
