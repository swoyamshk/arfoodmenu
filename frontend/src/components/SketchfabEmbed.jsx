import React from 'react';

export default function SketchfabEmbed() {
  return (
    <div className="sketchfab-embed-wrapper mx-auto my-8" style={{ maxWidth: "640px", height: "480px" }}>
      <iframe
        title="Brain Activity Simulation"
        frameBorder="0"
        allowFullScreen
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        src="https://sketchfab.com/models/3cf448288b6048818d6ecc1160d4aa05/embed"
        style={{ width: "100%", height: "100%" }}
      ></iframe>
      <p style={{ fontSize: "13px", fontWeight: "normal", margin: "5px", color: "#4A4A4A" }}>
        <a
          href="https://sketchfab.com/3d-models/brain-activity-simulation-3cf448288b6048818d6ecc1160d4aa05?utm_medium=embed&utm_campaign=share-popup&utm_content=3cf448288b6048818d6ecc1160d4aa05"
          target="_blank"
          rel="nofollow noreferrer"
          style={{ fontWeight: "bold", color: "#1CAAD9" }}
        >
          Brain Activity Simulation
        </a>{" "}
        by{" "}
        <a
          href="https://sketchfab.com/wellnesscomputational?utm_medium=embed&utm_campaign=share-popup&utm_content=3cf448288b6048818d6ecc1160d4aa05"
          target="_blank"
          rel="nofollow noreferrer"
          style={{ fontWeight: "bold", color: "#1CAAD9" }}
        >
          Wellness Computational
        </a>{" "}
        on{" "}
        <a
          href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=3cf448288b6048818d6ecc1160d4aa05"
          target="_blank"
          rel="nofollow noreferrer"
          style={{ fontWeight: "bold", color: "#1CAAD9" }}
        >
          Sketchfab
        </a>
      </p>
    </div>
  );
}
