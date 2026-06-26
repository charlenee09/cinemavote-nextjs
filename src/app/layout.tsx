import './globals.css'; 
import Navbar from '../components/Navbar'; 

export const metadata = {
  title: 'CinemaVote',
  description: 'Temukan, jelajahi, dan berikan vote untuk film serta serial TV terbaik pilihanmu.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Navbar /> 
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}