"use client"

import { useState } from "react"
import { Box, Flex, Button, IconButton, Text, HStack, VStack, Image, Tooltip } from "@chakra-ui/react"
import { Trophy, BookOpen, PlusCircle, User, Menu, X, LogIn } from "lucide-react"
import { ColorModeToggle } from "../ui/color-mode"
import LogoSrc from "src/assets/Logo.svg"

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
  isLoggedIn?: boolean
}

export function CustomJumbotron({ currentPage, onNavigate, isLoggedIn = false }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: "/", label: "Inicio", icon: Trophy },
    { id: "/", label: "Asignaturas", icon: BookOpen },
    { id: "/", label: "Crear Reto", icon: PlusCircle },
  ]

  const isAuthPage = currentPage === "/login" || currentPage === "/registro"

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
        <Flex
          as="button"
          alignItems="center"
          gap="2"
          onClick={() => onNavigate("/")}
          cursor="pointer"
        >
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
                return (
                  <Tooltip.Root key={item.label}>
                    <Tooltip.Trigger asChild>
                      <Button
                        variant={currentPage === item.id ? "solid" : "ghost"}
                        bg={currentPage === item.id ? "surface.secondary" : "transparent"}
                        color={currentPage === item.id ? "surface.bg" : "fg"}
                        size="sm"
                        aria-label="En desarrollo"
                        onClick={() => onNavigate(item.id)}
                        _hover={{ bg: "bg.subtle", color: "fg" }}
                      >
                        <Icon size={16} />
                        {item.label}
                      </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Positioner>
                      <Tooltip.Content
                        bg="bg.canvas"
                        color="fg"
                        borderColor="border"
                        borderWidth="1px"
                        borderRadius="md"
                        p="2"
                        zIndex="popover"
                      >
                        <Tooltip.Arrow />
                        En desarrollo
                      </Tooltip.Content>
                    </Tooltip.Positioner>
                  </Tooltip.Root>
                )
              })}
            </HStack>
          )}
        </Box>

        {/* Desktop Auth */}
        <Box>
          <HStack gap="2" display={{ base: "none", md: "flex" }}>
            {isLoggedIn ? (
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button
                    variant="ghost"
                    color="fg"
                    size="sm"
                    onClick={() => onNavigate("/")}
                    _hover={{ bg: "bg.subtle" }}
                  >
                    <User size={16} />
                    Mi Perfil
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Positioner>
                  <Tooltip.Content bg="bg.canvas" color="fg" borderColor="border" borderWidth="1px" borderRadius="md" p="2" zIndex="popover">
                    <Tooltip.Arrow />
                    En desarrollo
                  </Tooltip.Content>
                </Tooltip.Positioner>
              </Tooltip.Root>
            ) : (
              <>
                {/* Botón Iniciar Sesión → navega a /login */}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Button
                      variant={"outline"}
                      bg="bg.canvas"
                      borderColor="primary.solid"
                      color="primary.solid"
                      onClick={() => onNavigate("/login")}
                     _hover={{ bg: "bg.subtle" , color: "fg" , borderColor: "bg.subtle"}}
                    >
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

                {/* Botón Registrarse → navega a /registro */}
                <Button
                  bg="brand.500"
                  color="bg"
                  size="sm"
                  onClick={() => onNavigate("/registro")}
                  _hover={{ bg: "brand.600" }}
                >
                  Registrarse
                </Button>
              </>
            )}
            <ColorModeToggle />
          </HStack>
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          variant="ghost"
          color="fg"
          aria-label="Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          _hover={{ bg: "bg.subtle" }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </IconButton>
        <Box display={{ base: "block", md: "none" }}>
          <ColorModeToggle />
        </Box>
      </Flex>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <Box
          borderTop="1px solid"
          borderColor="border"
          bg="bg.canvas"
          px="4"
          py="4"
          display={{ md: "none" }}
        >
          <VStack gap="2" align="stretch">
            {!isAuthPage && navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  justifyContent="flex-start"
                  color={currentPage === item.id ? "bg" : "fg"}
                  bg={currentPage === item.id ? "fg" : "transparent"}
                  onClick={() => { onNavigate(item.id); setMobileMenuOpen(false) }}
                  _hover={{ bg: "bg.subtle" }}
                >
                  <Icon size={16} />
                  {item.label}
                </Button>
              )
            })}
            <Box borderTop="1px solid" borderColor="border" my="1" />
            {isLoggedIn ? (
              <Button
                variant="ghost"
                justifyContent="flex-start"
                color="fg"
                onClick={() => { onNavigate("/"); setMobileMenuOpen(false) }}
                _hover={{ bg: "bg.subtle" }}
              >
                <User size={16} />
                Mi Perfil
              </Button>
            ) : (
              <>
                {/* Iniciar Sesión móvil → navega a /login */}
                <Button
                  bg="bg.canvas"
                  borderColor="primary.solid"
                  color="primary.solid"
                  onClick={() => onNavigate("/login")}
                  _hover={{ bg: "bg.subtle" , color: "fg" , borderColor: "bg.subtle"}}
                  justifyContent="start"
                >
                  <LogIn size={16} />
                  Iniciar Sesión
                </Button>
                <Button
                  bg="brand.500"
                  color="bg"
                  justifyContent="flex-start"
                  onClick={() => { onNavigate("/registro"); setMobileMenuOpen(false) }}
                  _hover={{ bg: "brand.600" }}
                >
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