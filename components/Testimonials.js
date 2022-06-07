import IframeResizer from 'iframe-resizer-react'

export default function Testimonials() {
  return(
    <div>
      <IframeResizer
        src="https://widget.senja.io/wall/reflio?&cardTheme=light&cardStyle=bordered"
        style={{ width: "1px", minWidth: "100%" }}
      />
    </div>
  );
}