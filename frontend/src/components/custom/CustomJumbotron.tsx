"use client"

import { useState } from "react"
import { Box, Flex, Button, IconButton, Text, HStack, VStack } from "@chakra-ui/react"
import { Code2, Trophy, BookOpen, PlusCircle, User, Menu, X, LogIn } from "lucide-react"
import { ColorModeToggle } from "../ui/color-mode"
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

  const isAuthPage = currentPage === "login" || currentPage === "registro"

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
          onClick={() => onNavigate("home")}
          cursor="pointer"
        >
          <Flex
            h="9"
            w="9"
            alignItems="center"
            justifyContent="center"
            borderRadius="lg"
            bg="brand.500"
          >
            <Code2 size={20} color="#0F0A1A" />
          </Flex>
          <Text fontWeight="bold" fontSize="xl" color="fg">
            Retos VdG
          </Text>
        </Flex>

        {/* Desktop Nav */}
        <Box>
            {!isAuthPage && (
                <HStack gap="1" display={{ base: "none", md: "flex" }}>
                    {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <Button
                        key={item.id}
                        variant={currentPage === item.id ? "solid" : "ghost"}
                        bg={currentPage === item.id ? "surface.secondary" : "transparent"}
                        color={currentPage === item.id ? "surface.bg" : "fg"}
                        size="sm"
                        onClick={() => onNavigate(item.id)}
                        _hover={{ bg: "bg.subtle" , color: "fg" }}
                        >
                        <Icon size={16} />
                        {item.label}
                        </Button>
                    )
                    })}
                </HStack>
            )}
        </Box>
        <Box>
            {/* Desktop Auth */}
            <HStack gap="2" display={{ base: "none", md: "flex" }}>
                {isLoggedIn ? (
                    <Button
                    variant="ghost"
                    color="fg"
                    size="sm"
                    onClick={() => onNavigate("perfil")}
                    _hover={{ bg: "bg.subtle" }}
                    >
                    <User size={16} />
                    Mi Perfil
                    </Button>
                ) : (
                    <>
                    <Button
                        variant="ghost"
                        color="fg"
                        size="sm"
                        onClick={() => onNavigate("login")}
                        _hover={{ bg: "bg.subtle" }}
                    >
                        <LogIn size={16} />
                        Iniciar Sesion
                    </Button>
                    <Button
                        bg="brand.500"
                        color="bg"
                        size="sm"
                        onClick={() => onNavigate("registro")}
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
                  key={item.id}
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
                onClick={() => { onNavigate("perfil"); setMobileMenuOpen(false) }}
                _hover={{ bg: "bg.subtle" }}
              >
                <User size={16} />
                Mi Perfil
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  color="fg"
                  onClick={() => { onNavigate("login"); setMobileMenuOpen(false) }}
                  _hover={{ bg: "bg.subtle" }}
                >
                  <LogIn size={16} />
                  Iniciar Sesion
                </Button>
                <Button
                  bg="brand.500"
                  color="bg"
                  justifyContent="flex-start"
                  onClick={() => { onNavigate("registro"); setMobileMenuOpen(false) }}
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