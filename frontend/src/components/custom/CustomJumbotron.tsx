"use client"

import { useState } from "react"
import {
  Box, Flex, Button, IconButton, Text, HStack, VStack,
  Image, Tooltip, Avatar, Menu, Portal,
} from "@chakra-ui/react"
import { Trophy, BookOpen, PlusCircle, Menu as MenuIcon, X, LogIn, LogOut, User, ChevronDown, Shield } from "lucide-react"
import { ColorModeToggle } from "../ui/color-mode"
import LogoSrc from "src/assets/Logo.svg"
import { useAuth } from "@/auth/context/AuthContext"
import { useNavigate } from "react-router"

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function CustomJumbotron({ currentPage, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { id: "/",           label: "Inicio",      icon: Trophy },
    { id: "/asignaturas",           label: "Asignaturas", icon: BookOpen },
    { id: "/crear-reto", label: "Crear Reto",  icon: PlusCircle, requiresAuth: true },
  ]

  const isAuthPage = currentPage === "/login" || currentPage === "/registro"

  const handleLogout = () => {
    logout()
    navigate("/")
    setMobileMenuOpen(false)
  }

  const handleNavClick = (item: typeof navItems[number]) => {
    if (item.requiresAuth && !isLoggedIn) {
      onNavigate("/login")
    } else {
      onNavigate(item.id)
    }
  }

  const initials = user
    ? `${user.name.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase()
    : "?"

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="50"
      borderBottom="1px solid"
      borderColor="border"
      bg="bg.canvas"
      backdropFilter="blur(12px)"
    >
      <Flex
        maxW="9xl"
        mx="auto"
        h="16"
        alignItems="center"
        justifyContent="space-between"
        px={{ base: "4", sm: "6", lg: "8" }}
      >
        {/* Logo */}
        <Flex as="button" flex="1" alignItems="center" gap="2" onClick={() => onNavigate("/")} cursor="pointer">
          <Flex h="9" w="9" alignItems="center" justifyContent="center" borderRadius="lg">
            <Image src={LogoSrc} alt="RaiseCode" w="full" h="full" scale={1.2} />
          </Flex>
          <Text fontWeight="bold" fontSize="2xl" color="fg" fontFamily="var(--chakra-fonts-heading)">
            RaiseCode
          </Text>
        </Flex>

        {/* Desktop Nav */}
        <Box>
          {!isAuthPage && (
            <HStack gap="1" display={{ base: "none", md: "flex" }}>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.id
                return (
                  <Button
                    key={item.label}
                    variant={isActive ? "solid" : "ghost"}
                    bg={isActive ? "surface.secondary" : "transparent"}
                    color={isActive ? "surface.bg" : "fg"}
                    size="sm"
                    onClick={() => handleNavClick(item)}
                    _hover={{ bg: "bg.subtle", color: "fg" }}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Button>
                )
              })}
            </HStack>
          )}
        </Box>

        {/* Desktop Auth */}
        <HStack flex="1" gap="2" justifyContent="flex-end" display={{ base: "none", md: "flex" }}>
          {isLoggedIn && user ? (
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button variant="ghost" size="sm" color="fg" px="2" _hover={{ bg: "bg.subtle" }}>
                  <Avatar.Root size="xs" bg="brand.500">
                    <Avatar.Fallback color="white" fontWeight="bold" fontSize="xs">
                      {initials}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <Box textAlign="left" display={{ base: "none", lg: "block" }}>
                    <Text fontSize="sm" fontWeight="semibold" lineHeight="1.2">{user.name}</Text>
                    <Text fontSize="xs" color="fg.muted" lineHeight="1.2">{user.email}</Text>
                  </Box>
                  <ChevronDown size={14} />
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content bg="bg.canvas" borderColor="border" borderWidth="1px" borderRadius="xl" minW="200px" shadow="lg" zIndex="popover">
                    <Box px="3" py="2" borderBottom="1px solid" borderColor="border">
                      <Text fontSize="sm" fontWeight="semibold">{user.name} {user.lastname}</Text>
                      <Text fontSize="xs" color="fg.muted">{user.email}</Text>
                    </Box>

                    <Menu.Item
                      value="perfil"
                      color="fg"
                      _hover={{ bg: "bg.subtle" }}
                      onClick={() => onNavigate("/perfil")}
                    >
                      <User size={14} />
                      Mi Perfil
                    </Menu.Item>
                    {user?.roles.includes('ADMIN') && (
                      <Menu.Item
                        value="admin"
                        color="fg"
                        _hover={{ bg: "bg.subtle" }}
                        onClick={() => onNavigate("/admin")}
                      >
                        <Shield size={14} />
                        Admin
                      </Menu.Item>
                    )}
                    <Menu.Separator borderColor="border" />
                    <Menu.Item value="logout" color="red.500" _hover={{ bg: "bg.subtle" }} onClick={handleLogout}>
                      <LogOut size={14} />
                      Cerrar Sesión
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          ) : (
            <>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button variant="outline" bg="bg.canvas" borderColor="primary.solid" color="primary.solid" onClick={() => onNavigate("/login")} _hover={{ bg: "bg.subtle", color: "fg", borderColor: "bg.subtle" }}>
                    <LogIn size={16} />
                    Iniciar Sesión
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Positioner>
                  <Tooltip.Content bg="bg.canvas" color="fg" borderColor="border" borderWidth="1px" borderRadius="md" p="2" zIndex="popover">
                    <Tooltip.Arrow />
                    Acceder a mi cuenta
                  </Tooltip.Content>
                </Tooltip.Positioner>
              </Tooltip.Root>
              <Button bg="brand.500" color="bg" size="sm" onClick={() => onNavigate("/registro")} _hover={{ bg: "bg.subtle", color: "fg" }}>
                Registrarse
              </Button>
            </>
          )}
          <ColorModeToggle />
        </HStack>

        {/* Mobile buttons */}
        <HStack display={{ base: "flex", md: "none" }} gap="1">
          <ColorModeToggle />
          <IconButton variant="ghost" color="fg" aria-label="Menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} _hover={{ bg: "bg.subtle" }}>
            {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </IconButton>
        </HStack>
      </Flex>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <Box borderTop="1px solid" borderColor="border" bg="bg.canvas" px="4" py="4" display={{ md: "none" }}>
          <VStack gap="2" align="stretch">
            {!isAuthPage && navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  justifyContent="flex-start"
                  color="fg"
                  onClick={() => { handleNavClick(item); setMobileMenuOpen(false) }}
                  _hover={{ bg: "bg.subtle" }}
                >
                  <Icon size={16} />
                  {item.label}
                </Button>
              )
            })}
            <Box borderTop="1px solid" borderColor="border" my="1" />
            {isLoggedIn && user ? (
              <>
                <Box px="2" py="2" bg="bg.subtle" borderRadius="lg">
                  <HStack gap="2">
                    <Avatar.Root size="sm" bg="brand.500">
                      <Avatar.Fallback color="white" fontWeight="bold" fontSize="xs">{initials}</Avatar.Fallback>
                    </Avatar.Root>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold">{user.name} {user.lastname}</Text>
                      <Text fontSize="xs" color="fg.muted">{user.email}</Text>
                    </Box>
                  </HStack>
                </Box>

                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  color="fg"
                  _hover={{bg: "bg.subtle"}}
                  onClick={() => {onNavigate("/perfil"); setMobileMenuOpen(false)}}
                >
                  <User size={16} />
                  Mi Perfil
                </Button>
                <Button variant="ghost" justifyContent="flex-start" color="red.500" onClick={handleLogout} _hover={{ bg: "bg.subtle" }}>
                  <LogOut size={16} />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button bg="bg.canvas" borderColor="primary.solid" color="primary.solid" onClick={() => { onNavigate("/login"); setMobileMenuOpen(false) }} _hover={{ bg: "bg.subtle" }} justifyContent="start">
                  <LogIn size={16} />
                  Iniciar Sesión
                </Button>
                <Button bg="brand.500" color="bg" justifyContent="flex-start" onClick={() => { onNavigate("/registro"); setMobileMenuOpen(false) }} _hover={{ bg: "brand.600" }}>
                  Registrarse
                </Button>
              </>
            )}
          </VStack>
        </Box>
      )}
    </Box>
  )
}
