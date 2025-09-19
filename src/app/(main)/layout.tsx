import Header from "@/components/header";

interface Props {
    children: React.ReactNode;
}

const Layout = ({children}: Props) => {
  return (
    <div className="p-4">
        <Header/>
        {children}
    </div>
  )
}

export default Layout