import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer() {
  return (
    <footer className="footer bg-blue-600 text-white bottom-0 left-0 w-full shadow-lg z-50">
      <div className="mx-20 flex justify-between items-center pt-4 pb-4">
        <div className="w-1/3">
          <h1 className="text-2xl font-bold">NinoList</h1>
          <h2 className="text-sm">Follow me on:</h2>
          <div className="flex flex-col space-y-2 mt-2 text-xl">
            <div className="flex items-center space-x-2">
              <a href="https://www.facebook.com/rafli.agusta" target="_blank" rel="noreferrer noopener">
                <FontAwesomeIcon icon={['fab', 'facebook']} size="lg" />
              </a>
              <h2 className="text-sm">facebook.com/rafli.agusta</h2>
            </div>
            <div className="flex items-center space-x-2">
              <a href="https://www.instagram.com/m.rafliagusta" target="_blank" rel="noreferrer noopener">
                <FontAwesomeIcon icon={['fab', 'instagram']} size="lg" />
              </a>
              <h2 className="text-sm">instagram.com/m.rafliagusta</h2>
            </div>
            <div className="flex items-center space-x-2">
              <a href="https://www.github.com/EnvRfli" target="_blank" rel="noreferrer noopener">
                <FontAwesomeIcon icon={['fab', 'github']} size="lg" />
              </a>
              <h2 className="text-sm">github.com/EnvRfli</h2>
            </div>
            <div className="flex items-center space-x-2">
              <a href="https://www.linkedin.com/in/rafli-rizalfa" target="_blank" rel="noreferrer noopener">
                <FontAwesomeIcon icon={['fab', 'linkedin']} size="lg" />
              </a>
              <h2 className="text-sm">linkedin.com/in/rafli-rizalfa</h2>
            </div>
          </div>
        </div>
        <div className="w-1/3">
          <h2 className="text-2xl font-bold">Contact</h2>
          <div className="flex flex-col space-y-2 mt-2 text-xl">
            <div className="flex items-center space-x-2">
              <a href="wa.me/6285764278342" target="_blank" rel="noreferrer noopener">
                <FontAwesomeIcon icon={['fab', 'whatsapp']} size="lg" />
              </a>
              <h2 className="text-sm">+62 857 6527 8342</h2>
            </div>
            <div className="flex items-center space-x-2">
              <a href="mailto:mrafliagusta@gmail.com" target="_blank" rel="noreferrer noopener">
                <FontAwesomeIcon icon={['fab', 'mailchimp']} size="lg" />
              </a>
              <h2 className="text-sm">mrafliagusta@gmail.com</h2>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
