

function Quotes() {
  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="mb-8">
        <svg className="w-12 h-12 mx-auto text-white/30 mb-6" fill="currentColor" viewBox="0 0 32 32">
          <path d="M10 8v8h4V8H10zm8 0v8h4V8h-4zm-8 12c-2.21 0-4-1.79-4-4h-2c0 3.31 2.69 6 6 6v-2zm8 0c-2.21 0-4-1.79-4-4h-2c0 3.31 2.69 6 6 6v-2z" />
        </svg>
      </div>
      
      <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8 text-white">
        "The customer service I received was exceptional. The support team went above and beyond to address my concerns."
      </blockquote>
      
      <div className="border-t border-white/20 pt-6">
        <h3 className="font-semibold text-white text-lg">Jules Winfield</h3>
        <p className="text-white/70 text-sm mt-1">CEO, Acme Inc</p>
      </div>
    </div>
  )
}

export default Quotes