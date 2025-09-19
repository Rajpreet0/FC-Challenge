import Image from "next/image"
import Logo from "../../public/fc_logo.png";

const Header = () => {
  return (
    <div>
        <Image
            src={Logo}
            width={80}
            height={80}
            alt="Logo"
        />
    </div>
  )
}

export default Header
 