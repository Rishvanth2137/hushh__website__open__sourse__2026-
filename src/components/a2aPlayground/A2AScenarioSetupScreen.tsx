/**
 * A2A Scenario Setup Screen (Screen 1)
 * 
 * Demo operator selects:
 * - Relying party (bank)
 * - User to verify (Ankit, etc.)
 * - Which A2A operations to demo
 */
'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  Checkbox,
  Button,
  FormControl,
  FormLabel,
  Divider,
  Icon,
  Badge,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import {
  A2AScenarioConfig,
  A2AScenarioSetupProps,
  DemoUserIdentifiers,
  ScenarioOperations,
  RelyingParty,
  DEMO_RELYING_PARTIES,
  DEFAULT_SCENARIO_CONFIG,
} from '../../types/a2aPlayground';

// =====================================================
// Animations
// =====================================================

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(159, 122, 234, 0.3); }
  50% { box-shadow: 0 0 40px rgba(159, 122, 234, 0.6); }
`;

// =====================================================
// Country Options
// =====================================================

const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'IN', label: 'India' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AE', label: 'UAE' },
  { value: 'SG', label: 'Singapore' },
];

const PHONE_CODES = [
  { value: '+1', label: '+1 (US)' },
  { value: '+91', label: '+91 (IN)' },
  { value: '+44', label: '+44 (UK)' },
  { value: '+971', label: '+971 (UAE)' },
  { value: '+65', label: '+65 (SG)' },
];

// =====================================================
// Component
// =====================================================

export const A2AScenarioSetupScreen: React.FC<A2AScenarioSetupProps> = ({
  onRunScenario,
}) => {
  // Form state
  const [selectedPartyId, setSelectedPartyId] = useState(
    DEFAULT_SCENARIO_CONFIG.relyingParty.id
  );
  const [user, setUser] = useState<DemoUserIdentifiers>(
    DEFAULT_SCENARIO_CONFIG.user
  );
  const [operations, setOperations] = useState<ScenarioOperations>(
    DEFAULT_SCENARIO_CONFIG.operations
  );

  // Get selected relying party
  const selectedParty = DEMO_RELYING_PARTIES.find(p => p.id === selectedPartyId) 
    || DEMO_RELYING_PARTIES[0];

  // Handle form submission
  const handleRun = () => {
    const config: A2AScenarioConfig = {
      relyingParty: selectedParty,
      user,
      operations,
    };
    onRunScenario(config);
  };

  // Check if at least one operation is selected
  const hasOperation = operations.verifyKycStatus || 
    operations.confirmKeyMatch || 
    operations.exportKycProfile;

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, purple.50, blue.50, white)"
      py={{ base: 6, md: 10 }}
      px={{ base: 4, md: 8, lg: 12 }}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative blurred background shapes */}
      <Box position="absolute" top="-10%" left="-5%" w="500px" h="500px" bg="purple.200" filter="blur(150px)" opacity="0.4" borderRadius="full" zIndex={0} />
      <Box position="absolute" bottom="-10%" right="-5%" w="600px" h="600px" bg="blue.200" filter="blur(150px)" opacity="0.4" borderRadius="full" zIndex={0} />
      
      <Container w="full" maxW="4xl" mx="auto" position="relative" zIndex={1}>
        {/* Header */}
        <VStack spacing={2} mb={8} textAlign="center">
          <Badge
            colorScheme="purple"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
          >
            A2A PROTOCOL DEMO
          </Badge>
          <Text
            fontSize={{ base: '3xl', md: '5xl' }}
            fontWeight="800"
            bgGradient="linear(to-r, purple.600, blue.500)"
            bgClip="text"
            lineHeight="1.2"
            letterSpacing="tight"
          >
            Agent-to-Agent KYC Playground
          </Text>
          <Text color="gray.600" fontSize="md" maxW="lg" mt={2}>
            Watch Bank KYC Copilot and Hushh KYC Agent collaborate 
            in real-time to verify identity and export KYC data.
          </Text>
        </VStack>

        {/* Main Form Card */}
        <Box
          bg="rgba(255, 255, 255, 0.7)"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.5)"
          borderRadius="3xl"
          p={{ base: 6, md: 10 }}
          boxShadow="xl"
          position="relative"
          zIndex={2}
        >
          <VStack spacing={{ base: 6, md: 8 }} align="stretch">
            {/* Section 1: Relying Party */}
            <Box>
              <Text
                fontSize="sm"
                fontWeight="600"
                color="purple.600"
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                1. Choose Relying Party
              </Text>
              
              <FormControl>
                <FormLabel color="gray.700" fontSize="sm">
                  Bank or Financial Institution
                </FormLabel>
                <Select
                  value={selectedPartyId}
                  onChange={(e) => setSelectedPartyId(e.target.value)}
                  w="full"
                  minW={0}
                  bg="white"
                  border="1px solid"
                  borderColor="gray.300"
                  color="black"
                  _hover={{ borderColor: 'purple.500' }}
                  _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px #805AD5' }}
                >
                  {DEMO_RELYING_PARTIES.map((party) => (
                    <option 
                      key={party.id} 
                      value={party.id}
                    >
                      {party.name} {party.description ? `– ${party.description}` : ''}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Divider borderColor="gray.200" />

            {/* Section 2: User to Verify */}
            <Box>
              <Text
                fontSize="sm"
                fontWeight="600"
                color="purple.600"
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                2. User to Verify
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 6 }}>
                {/* Full Name */}
                <FormControl>
                  <FormLabel color="gray.700" fontSize="sm">
                    Full Name
                  </FormLabel>
                  <Input
                    value={user.fullName}
                    onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                    placeholder="Enter full name"
                    w="full"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                    color="black"
                    _placeholder={{ color: 'gray.400' }}
                    _hover={{ borderColor: 'purple.500' }}
                    _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px #805AD5' }}
                  />
                </FormControl>

                {/* Phone */}
                <FormControl>
                  <FormLabel color="gray.700" fontSize="sm">
                    Phone Number
                  </FormLabel>
                  <HStack spacing={2} w="full">
                    <Select
                      value={user.phoneCountryCode}
                      onChange={(e) => setUser({ ...user, phoneCountryCode: e.target.value })}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      color="black"
                      w={{ base: "100px", sm: "140px" }}
                      minW={0}
                      _hover={{ borderColor: 'purple.500' }}
                      _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px #805AD5' }}
                    >
                      {PHONE_CODES.map((code) => (
                        <option 
                          key={code.value} 
                          value={code.value}
                        >
                          {code.label}
                        </option>
                      ))}
                    </Select>
                    <Input
                      value={user.phoneNumber}
                      onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                      placeholder="Phone number"
                      w="full"
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      color="black"
                      _placeholder={{ color: 'gray.400' }}
                      _hover={{ borderColor: 'purple.500' }}
                      _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px #805AD5' }}
                    />
                  </HStack>
                </FormControl>

                {/* Country */}
                <FormControl>
                  <FormLabel color="gray.700" fontSize="sm">
                    Country
                  </FormLabel>
                  <Select
                    value={user.country}
                    onChange={(e) => setUser({ ...user, country: e.target.value })}
                    w="full"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                    color="black"
                    _hover={{ borderColor: 'purple.500' }}
                    _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px #805AD5' }}
                  >
                    {COUNTRY_OPTIONS.map((country) => (
                      <option 
                        key={country.value} 
                        value={country.value}
                      >
                        {country.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {/* Email (Optional) */}
                <FormControl>
                  <FormLabel color="gray.700" fontSize="sm">
                    Email (Optional)
                  </FormLabel>
                  <Input
                    value={user.email || ''}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    placeholder="email@example.com"
                    type="email"
                    w="full"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                    color="black"
                    _placeholder={{ color: 'gray.400' }}
                    _hover={{ borderColor: 'purple.500' }}
                    _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px #805AD5' }}
                  />
                </FormControl>

                {/* SSN Last 4 (for key match demo) */}
                {operations.confirmKeyMatch && (
                  <GridItem colSpan={{ base: 1, md: 2 }}>
                    <FormControl>
                      <FormLabel color="gray.700" fontSize="sm">
                        SSN Last 4 Digits (for key match demo)
                      </FormLabel>
                      <Input
                        value={user.ssnLast4 || ''}
                        onChange={(e) => setUser({ ...user, ssnLast4: e.target.value })}
                        placeholder="1234"
                        maxLength={4}
                        w="full"
                        maxW={{ base: "full", md: "50%" }}
                        bg="white"
                        border="1px solid"
                        borderColor="gray.300"
                        color="black"
                        _placeholder={{ color: 'gray.400' }}
                        _hover={{ borderColor: 'purple.500' }}
                        _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px #805AD5' }}
                      />
                      <Text fontSize="xs" color="gray.600" mt={1}>
                        🔒 This is only used to demo VerifyFieldMatch – never shared in clear
                      </Text>
                    </FormControl>
                  </GridItem>
                )}
              </SimpleGrid>
            </Box>

            <Divider borderColor="gray.200" />

            {/* Section 3: Operations */}
            <Box>
              <Text
                fontSize="sm"
                fontWeight="600"
                color="purple.600"
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                3. What should agents do?
              </Text>

              <VStack align="stretch" spacing={3}>
                <Box
                  as="button"
                  onClick={() => setOperations({ ...operations, verifyKycStatus: !operations.verifyKycStatus })}
                  w="full"
                  textAlign="left"
                  p={4}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor={operations.verifyKycStatus ? "purple.400" : "transparent"}
                  bg={operations.verifyKycStatus ? "purple.50" : "white"}
                  boxShadow="sm"
                  _hover={{ boxShadow: "md", transform: "translateY(-1px)" }}
                  transition="all 0.2s"
                >
                  <HStack spacing={4}>
                    <Box
                      w="24px"
                      h="24px"
                      borderRadius="full"
                      bg={operations.verifyKycStatus ? "purple.500" : "gray.200"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                      flexShrink={0}
                    >
                      {operations.verifyKycStatus && <Text fontSize="xs">✓</Text>}
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text color={operations.verifyKycStatus ? "purple.700" : "black"} fontSize="sm" fontWeight="bold">
                        Verify KYC Status
                      </Text>
                      <Text color="gray.600" fontSize="xs">
                        CheckKYCStatus – Is this user verified?
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                <Box
                  as="button"
                  onClick={() => setOperations({ ...operations, confirmKeyMatch: !operations.confirmKeyMatch })}
                  w="full"
                  textAlign="left"
                  p={4}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor={operations.confirmKeyMatch ? "purple.400" : "transparent"}
                  bg={operations.confirmKeyMatch ? "purple.50" : "white"}
                  boxShadow="sm"
                  _hover={{ boxShadow: "md", transform: "translateY(-1px)" }}
                  transition="all 0.2s"
                >
                  <HStack spacing={4}>
                    <Box
                      w="24px"
                      h="24px"
                      borderRadius="full"
                      bg={operations.confirmKeyMatch ? "purple.500" : "gray.200"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                      flexShrink={0}
                    >
                      {operations.confirmKeyMatch && <Text fontSize="xs">✓</Text>}
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text color={operations.confirmKeyMatch ? "purple.700" : "black"} fontSize="sm" fontWeight="bold">
                        Confirm Key Match
                      </Text>
                      <Text color="gray.600" fontSize="xs">
                        VerifyFieldMatch – Does SSN last4 match?
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                <Box
                  as="button"
                  onClick={() => setOperations({ ...operations, exportKycProfile: !operations.exportKycProfile })}
                  w="full"
                  textAlign="left"
                  p={4}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor={operations.exportKycProfile ? "purple.400" : "transparent"}
                  bg={operations.exportKycProfile ? "purple.50" : "white"}
                  boxShadow="sm"
                  _hover={{ boxShadow: "md", transform: "translateY(-1px)" }}
                  transition="all 0.2s"
                >
                  <HStack spacing={4}>
                    <Box
                      w="24px"
                      h="24px"
                      borderRadius="full"
                      bg={operations.exportKycProfile ? "purple.500" : "gray.200"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                      flexShrink={0}
                    >
                      {operations.exportKycProfile && <Text fontSize="xs">✓</Text>}
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text color={operations.exportKycProfile ? "purple.700" : "black"} fontSize="sm" fontWeight="bold">
                        Export KYC Profile
                      </Text>
                      <Text color="gray.600" fontSize="xs">
                        ExportKYCProfile – Get normalized JSON profile
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </VStack>
            </Box>

            <Divider borderColor="gray.200" />

            {/* Run Button */}
            <Button
              size="lg"
              bgGradient="linear(to-r, purple.500, blue.500)"
              color="white"
              onClick={handleRun}
              isDisabled={!user.fullName || !hasOperation}
              w="100%"
              h="64px"
              fontSize="lg"
              fontWeight="bold"
              borderRadius="xl"
              _hover={{
                bgGradient: "linear(to-r, purple.600, blue.600)",
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px rgba(159, 122, 234, 0.5)',
              }}
              _active={{ transform: 'translateY(0)' }}
              transition="all 0.2s"
            >
              🚀 Run A2A KYC Scenario
            </Button>

            {/* Help Text */}
            <Text 
              fontSize="xs" 
              color="gray.600" 
              textAlign="center"
            >
              This will simulate a real A2A conversation between {selectedParty.name} 
              and Hushh KYC Agent.
            </Text>
          </VStack>
        </Box>

        {/* Footer */}
        <Text 
          fontSize="xs" 
          color="gray.500" 
          textAlign="center" 
          mt={6}
        >
          A2A Protocol Demo • Hushh KYC Network • ADFW 2025
        </Text>
      </Container>
    </Box>
  );
};

export default A2AScenarioSetupScreen;
