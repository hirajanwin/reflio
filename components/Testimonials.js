import IframeResizer from 'iframe-resizer-react'

export default function Testimonials() {
  return(
    <div className="bg-white py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="sm:flex sm:flex-col sm:align-center text-center mb-5">
          <h2 className="text-4xl tracking-tight font-extrabold lg:text-5xl relative z-10 text-center">
            Our early supporters
          </h2>
        </div>
        <IframeResizer
          src="https://embed.testimonial.to/w/reflio?theme=light&card=base"
          style={{ width: "1px", minWidth: "100%" }}
        />
      </div>
    </div>
  );
}