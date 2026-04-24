# WanderLust 
A travel accommodation platform where users can explore, post, and review stays with integrated mapping and cloud media management.

### Key Technical Highlights
* [cite_start]**Automated Geocoding:** Intercepts text addresses to query the Mapbox Geocoding API, extracting GeoJSON coordinates for interactive map pins[cite: 11, 14, 50].
* [cite_start]**Cloud Media Pipeline:** Integrated Multer and Cloudinary for seamless image uploads with on-the-fly URL transformations for optimized thumbnail delivery[cite: 11, 16, 52].
* [cite_start]**MVC Architecture:** Cleanly decoupled routing, database schemas, and request handlers to ensure a maintainable and scalable codebase[cite: 18].
* [cite_start]**Referential Integrity:** Implemented Mongoose post-hooks to handle cascading deletions, ensuring orphaned reviews are purged when a listing is removed[cite: 15, 72, 73].

### Tech Stack
* **Frontend:** HTML, CSS, Bootstrap, EJS
* [cite_start]**Backend:** Node.js, ExpressJS [cite: 24]
* [cite_start]**Database:** MongoDB [cite: 25]
* [cite_start]**Services:** Mapbox API, Cloudinary [cite: 28]
