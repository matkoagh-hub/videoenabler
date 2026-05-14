// VideoEnabler – Video Catalog
// Edit this file to add, remove, or update videos.
// Supported types: "video/mp4", "video/webm", "application/x-mpegURL" (HLS .m3u8)

const VIDEO_CATALOG = [
  {
    id: "big-buck-bunny",
    title: "Big Buck Bunny",
    description: "A short animated film about a big rabbit who gets revenge on small animals that bully him. Classic open-source demo video.",
    thumbnail: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    type: "video/mp4",
    duration: "9:56",
    category: "demo",
    tags: ["animation", "demo", "blender"]
  },
  {
    id: "elephant-dream",
    title: "Elephant Dream",
    description: "The first open movie from the Blender Foundation. A surreal journey through a mechanical world.",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Elephant_Dream_s5_both.jpg/640px-Elephant_Dream_s5_both.jpg",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    type: "video/mp4",
    duration: "10:54",
    category: "demo",
    tags: ["animation", "demo", "blender"]
  },
  {
    id: "hls-test",
    title: "HLS Stream Test",
    description: "Apple HLS test stream — demonstrates adaptive bitrate streaming (HLS). Uses standard HTTPS, no WebSockets.",
    thumbnail: "",
    src: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
    type: "application/x-mpegURL",
    duration: "Live",
    category: "test",
    tags: ["hls", "test", "streaming"]
  }
];
