import Link from "next/link"
import Navigation from "../Navigation/Navigation"

const Header = () => {
  return (
    <header className="bg-black/95 text-white sticky top-0 z-50">
      <div className="flex py-7 px-5 md:px-10 justify-between items-center max-w-[1920px]">
        <div>
          <Link className="text-3xl" href='/'>
            Canrey
          </Link>
        </div>
        <Navigation />
      </div>
    </header>
  )
}

export default Header
