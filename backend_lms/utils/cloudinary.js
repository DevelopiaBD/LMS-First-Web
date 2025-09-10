// // utils/cloudinary.js
// const multer = require("multer");
// const { v2: cloudinary } = require("cloudinary");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// require("dotenv").config();

// // -------------------------
// // Cloudinary Config
// // -------------------------
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key:    process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });

// // -------------------------
// // Multer + Cloudinary Storage
// // -------------------------
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     const isVideo = file.mimetype.startsWith("video");
//     const isImage = file.mimetype.startsWith("image");
//     let folderName = "uploads";
//     if (isVideo) folderName = "course_videos";
//     else if (isImage) folderName = "course_images";

//     const base = {
//       folder: folderName,
//       public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
//       resource_type: isVideo ? "video" : "image",
//       // 🔐 keep videos restricted
//       type: isVideo ? "authenticated" : "upload",
//     };

//     // Optional: allow common formats
//     if (isVideo) {
//       base.allowed_formats = ["mp4", "mov", "mkv", "m4v", "webm"];
//       // Optional (faster first-play): pre-generate HLS in background
//       // base.eager = [{ streaming_profile: "hd", format: "m3u8", resource_type: "video" }];
//       // base.eager_async = true;
//     }

//     return base;
//   },
// });

// const upload = multer({ storage });

// // -------------------------
// // Signed Video URL Generator (HLS)
// // -------------------------
// const getSignedVideoUrl = (publicId) => {
//   if (!publicId) return null;

//   // expire in 5 minutes
//   const expiresAt = Math.floor(Date.now() / 1000) + 300;

//   // Generate a *signed* HLS (.m3u8) URL for an authenticated video
//   // Example output (path will include the signed token):
//   // https://res.cloudinary.com/<cloud>/video/authenticated/s--TOKEN--/v1/<publicId>.m3u8
//   const url = cloudinary.url(publicId, {
//     resource_type: "video",
//     type: "authenticated",
//     format: "m3u8",                 // HLS playlist
//     sign_url: true,
//     expires_at: expiresAt,
//     transformation: [
//       { streaming_profile: "hd" },  // adaptive bitrate
//     ],
//   });

//   return url;
// };

// module.exports = {
//   upload,
//   getSignedVideoUrl,
//   cloudinary,
// };





















// utils/cloudinary.js
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// -------------------------
// Cloudinary Config
// -------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// -------------------------
// Multer + Cloudinary Storage
// -------------------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video");
    const isImage = file.mimetype.startsWith("image");
    let folderName = "uploads";
    if (isVideo) folderName = "course_videos";
    else if (isImage) folderName = "course_images";

    const base = {
      folder: folderName,
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
      resource_type: isVideo ? "video" : "image",
      // 🔐 keep videos restricted
      type: isVideo ? "authenticated" : "upload",
    };

    // 🎥 Video options
    if (isVideo) {
      base.allowed_formats = ["mp4", "mov", "mkv", "m4v", "webm"];
      // Optional (faster first-play): pre-generate HLS in background
      // base.eager = [{ streaming_profile: "hd", format: "m3u8", resource_type: "video" }];
      // base.eager_async = true;
    }

    // 🖼 Image optimization
    if (isImage) {
      base.format = "webp"; // Always convert to WebP
      base.transformation = [
        { quality: "auto", fetch_format: "auto" }, // auto compression & fast web delivery
      ];
      // Optional responsive breakpoints for smaller devices
      base.responsive_breakpoints = [
        {
          create_derived: true,
          bytes_step: 20000, // ~20kb step
          max_width: 1200,
          max_images: 3,
        },
      ];
    }

    return base;
  },
});

const upload = multer({ storage });



const getSignedMp4Url = (publicId) => {
  if (!publicId) return null;

  const expiresAt = Math.floor(Date.now() / 1000) + 300; // 5 min expiry

  return cloudinary.url(publicId, {
    resource_type: "video",
    type: "authenticated",
    format: "mp4",       // 👈 MP4 instead of HLS
    sign_url: true,
    expires_at: expiresAt,
  });
};



// -------------------------
// Signed Video URL Generator (HLS)
// -------------------------
const getSignedVideoUrl = (publicId) => {
  if (!publicId) return null;

  // expire in 5 minutes
  const expiresAt = Math.floor(Date.now() / 1000) + 300;

  // Generate a *signed* HLS (.m3u8) URL for an authenticated video
  // Example output (path will include the signed token):
  // https://res.cloudinary.com/<cloud>/video/authenticated/s--TOKEN--/v1/<publicId>.m3u8
  const url = cloudinary.url(publicId, {
    resource_type: "video",
    type: "authenticated",
    format: "m3u8",                 // HLS playlist
    sign_url: true,
    expires_at: expiresAt,
    transformation: [
      { streaming_profile: "hd" },  // adaptive bitrate
    ],
  });

  return url;
};

module.exports = {
  upload,
  getSignedVideoUrl,
  cloudinary,
  getSignedMp4Url,
};





























// // utils/cloudinary.js
// const multer = require("multer");
// const { v2: cloudinary } = require("cloudinary");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const fs = require("fs");
// require("dotenv").config();

// // -------------------------
// // Cloudinary Config
// // -------------------------
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key:    process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });

// // -------------------------
// // Multer + Cloudinary Storage (for images, small videos)
// // -------------------------
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     const isVideo = file.mimetype.startsWith("video");
//     const isImage = file.mimetype.startsWith("image");
//     let folderName = "uploads";
//     if (isVideo) folderName = "course_videos";
//     else if (isImage) folderName = "course_images";

//     const base = {
//       folder: folderName,
//       public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
//       resource_type: isVideo ? "video" : "image",
//       // 🔐 keep videos restricted
//       type: isVideo ? "authenticated" : "upload",
//     };

//     // 🎥 Video options
//     if (isVideo) {
//       base.allowed_formats = ["mp4", "mov", "mkv", "m4v", "webm"];
//     }

//     // 🖼 Image optimization
//     if (isImage) {
//       base.format = "webp";
//       base.transformation = [{ quality: "auto", fetch_format: "auto" }];
//       base.responsive_breakpoints = [
//         { create_derived: true, bytes_step: 20000, max_width: 1200, max_images: 3 },
//       ];
//     }

//     return base;
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 1024 * 1024 * 500 }, // 500MB
// });




// // -------------------------
// // ✅ Large Video Upload (chunked) + Delete local file
// // -------------------------
// const uploadLargeVideo = async (filePath, folderName = "course_videos") => {
//   try {
//     const result = await cloudinary.uploader.upload_large(filePath, {
//       resource_type: "video",
//       folder: folderName,
//       chunk_size: 20 * 1024 * 1024, // 20MB প্রতি chunk
//       type: "authenticated",
//       eager_async: true,
//     });

//     // লোকাল ফাইল মুছে ফেলা
//     fs.unlink(filePath, (err) => {
//       if (err) console.error("❌ Local file delete failed:", err);
//       else console.log("✅ Local file deleted:", filePath);
//     });

//     return result;
//   } catch (err) {
//     console.error("❌ Large video upload failed:", err);
//     throw err;
//   }
// };

// // -------------------------
// // Signed MP4 URL
// // -------------------------
// const getSignedMp4Url = (publicId) => {
//   if (!publicId) return null;
//   const expiresAt = Math.floor(Date.now() / 1000) + 300;
//   return cloudinary.url(publicId, {
//     resource_type: "video",
//     type: "authenticated",
//     format: "mp4",
//     sign_url: true,
//     expires_at: expiresAt,
//   });
// };

// // -------------------------
// // Signed Video URL (HLS)
// // -------------------------
// const getSignedVideoUrl = (publicId) => {
//   if (!publicId) return null;
//   const expiresAt = Math.floor(Date.now() / 1000) + 300;
//   return cloudinary.url(publicId, {
//     resource_type: "video",
//     type: "authenticated",
//     format: "m3u8",
//     sign_url: true,
//     expires_at: expiresAt,
//     transformation: [{ streaming_profile: "hd" }],
//   });
// };

// module.exports = {
//   upload,              // small uploads (image/small video)
//   uploadLargeVideo,    // ✅ big videos
//   getSignedVideoUrl,
//   getSignedMp4Url,
//   cloudinary,
// };






