import Logo from '@/components/icons/Logo';

export default function Footer() {
  return (
    <footer aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="wrapper wrapper-max py-8">
        <div className="text-center">
          <div className="space-y-5">
            <Logo className="h-10 w-auto mx-auto"/>
            <p className="text-gray-500 text-base">
              The complete competitor analysis tool for brands.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">&copy; 2022 Reflio (McIlroy Limited). All rights reserved.</p>
          <div className="flex items-center justify-center mt-4">
            <a href="/privacy" className="hover:underline text-xs mx-1 text-gray-400 hover:text-gray-500">Privacy</a>
            <a href="/terms" className="hover:underline text-xs mx-1 text-gray-400 hover:text-gray-500">Terms</a>
            <a href="/changelog" className="hover:underline text-xs mx-1 text-gray-400 hover:text-gray-500">Changelog</a>
          </div>
        </div>
      </div>
    </footer>
  );
}