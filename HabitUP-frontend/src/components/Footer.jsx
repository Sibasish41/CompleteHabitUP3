const Footer = () => {
  return (
    <footer 
      className="relative text-white text-center py-16 px-0"
      style={{
        background: 'url(/img/FooterBG.png) center center no-repeat',
        backgroundSize: 'cover'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary-500/80"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h3 className="text-4xl font-bold mb-4 font-raleway">HabitUP</h3>
        <p className="text-base italic mb-8">
          Transform your life through the power of consistent habits
        </p>
        
        {/* Social Links */}
        <div className="flex justify-center space-x-4 mb-8">
          <a 
            href="#" 
            className="w-10 h-10 bg-accent-400 text-primary-500 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-accent-500 hover:scale-110 hover:shadow-lg group"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook-f text-lg group-hover:animate-pulse"></i>
          </a>
          <a 
            href="#" 
            className="w-10 h-10 bg-accent-400 text-primary-500 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-accent-500 hover:scale-110 hover:shadow-lg group"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter text-lg group-hover:animate-pulse"></i>
          </a>
          <a 
            href="#" 
            className="w-10 h-10 bg-accent-400 text-primary-500 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-accent-500 hover:scale-110 hover:shadow-lg group"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram text-lg group-hover:animate-pulse"></i>
          </a>
          <a 
            href="#" 
            className="w-10 h-10 bg-accent-400 text-primary-500 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-accent-500 hover:scale-110 hover:shadow-lg group"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin-in text-lg group-hover:animate-pulse"></i>
          </a>
          <a 
            href="#" 
            className="w-10 h-10 bg-accent-400 text-primary-500 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-accent-500 hover:scale-110 hover:shadow-lg group"
            aria-label="YouTube"
          >
            <i className="fab fa-youtube text-lg group-hover:animate-pulse"></i>
          </a>
        </div>
        
        {/* Copyright */}
        <div className="pt-6 border-t border-white/20">
          <p className="text-sm">
            © 2024 HabitUP. All rights reserved. A unit of Sadhana Mandira Charitable Trust
          </p>
          <p className="text-xs mt-2">
            Designed with ❤️ for your transformation journey
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer