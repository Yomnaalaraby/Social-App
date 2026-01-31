import { Navbar as HeroNav, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export default function Navbar() {
    const { token, setToken, setUserData } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem('token');
        setToken(null);
        setUserData?.(null);
        setIsMenuOpen(false);
        navigate('/login');
    }

    return <>
        <HeroNav onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen} isBordered>
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
            </NavbarContent>

            <NavbarContent justify="center">
                <NavbarBrand>
                    <Link className="font-bold text-inherit" to={'/'}>Social App</Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="end">
                {token ? (
                    <>
                        <NavbarItem>
                            <Link className="text-foreground" to={'/profile'}>Profile</Link>
                        </NavbarItem>
                        <NavbarItem onClick={logout}>
                            <span className="cursor-pointer text-foreground">LogOut</span>
                        </NavbarItem>
                    </>
                ) : (
                    <>
                        <NavbarItem><Link className="text-foreground" to={'/register'}>Register</Link></NavbarItem>
                        <NavbarItem><Link className="text-foreground" to={'/login'}>Login</Link></NavbarItem>
                    </>
                )}
            </NavbarContent>

            <NavbarMenu className="pt-6">
                {token ? (
                    <>
                        <NavbarMenuItem>
                            <Link className="w-full text-lg py-2" to="/profile" onClick={() => setIsMenuOpen(false)}>
                                My Profile
                            </Link>
                        </NavbarMenuItem>
                        <NavbarMenuItem onClick={logout}>
                            <span className="w-full text-lg py-2 text-danger cursor-pointer">
                                LogOut
                            </span>
                        </NavbarMenuItem>
                    </>
                ) : (
                    <>
                        <NavbarMenuItem>
                            <Link className="w-full text-lg py-2" to="/login" onClick={() => setIsMenuOpen(false)}>
                                Login
                            </Link>
                        </NavbarMenuItem>
                        <NavbarMenuItem>
                            <Link className="w-full text-lg py-2" to="/register" onClick={() => setIsMenuOpen(false)}>
                                Register
                            </Link>
                        </NavbarMenuItem>
                    </>
                )}
            </NavbarMenu>
        </HeroNav>
    </>;
}