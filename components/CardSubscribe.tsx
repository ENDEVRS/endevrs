import { FormEvent, useState, useEffect, useRef } from "react";
import {
  Stack,
  FormControl,
  Input,
  Button,
  Heading,
  Text,
  Container,
  Flex,
  CloseButton,
  Show,
  useColorModeValue,
} from "@chakra-ui/react";
import { ImCheckmark } from "react-icons/im";

type SubscribeState = "init" | "submitting" | "success" | "fail";

interface Props {
  showCloseButton?: boolean;
}

export default function CardSubscribe({ showCloseButton = true }: Props) {
  const inputEl = useRef<HTMLInputElement>(null);
  const [showSubscribe, setShowSubscribe] = useState<boolean>(false);
  const [subscribeState, setSubscribeState] = useState<SubscribeState>("init");

  const subscribeMessage: { [key: string]: string } = {
    init: "One email per week, never any spam 🙅‍♂️",
    success: "Success! A confirmation email has been sent! 🚀",
    fail: "Oh no an error! 😭 Please try again later.",
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const inputBorderColor = useColorModeValue("gray.300", "gray.700");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubscribeState("submitting");

    const response = await fetch("/api/subscription", {
      body: JSON.stringify({
        email: inputEl?.current?.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    });

    if (!response.ok) return setSubscribeState("fail");

    return setSubscribeState("success");
  };

  const handleClose = () => {
    sessionStorage.setItem("subscribeDeclined", "true");
    return setShowSubscribe(false);
  };

  useEffect(() => {
    const subscribeDeclined = sessionStorage.getItem("subscribeDeclined");
    if (!subscribeDeclined) return setShowSubscribe(true);
  }, []);

  return showSubscribe ? (
    <Flex
      position="fixed"
      bottom={{ base: 0, sm: 5 }}
      right={{ base: "auto", sm: 5 }}
      left={{ base: "auto", sm: "auto" }}
      width={{ base: "100%", sm: "auto" }}
      align="center"
      justify="center"
      bg={bgColor}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Container maxW="lg" p={{ base: "24px 32px 4px 32px", sm: 6 }}>
        {showCloseButton && (
          <CloseButton
            aria-label="Close"
            size="sm"
            sx={{
              position: "absolute",
              top: 2,
              right: 2,
            }}
            onClick={handleClose}
          />
        )}
        <Show above="sm">
          <Heading
            as="h2"
            fontSize={{ base: "xl", sm: "2xl" }}
            textAlign="center"
            mb={5}
          >
            {"Subscribe to the Newsletter"}
          </Heading>
        </Show>
        <Stack
          direction="row"
          as="form"
          spacing={{ base: "4px", sm: "12px" }}
          onSubmit={handleSubmit}
        >
          <FormControl>
            <Input
              variant="solid"
              borderWidth={1}
              color="gray.800"
              _placeholder={{
                color: "gray.400",
              }}
              borderColor={inputBorderColor}
              id="email"
              type="email"
              required
              placeholder="Your Email"
              aria-label="Your Email"
              ref={inputEl}
              disabled={subscribeState !== "init"}
            />
          </FormControl>
          <FormControl w="40%">
            <Button
              w="100%"
              colorScheme={subscribeState === "success" ? "green" : "blue"}
              isLoading={subscribeState === "submitting"}
              type={subscribeState === "success" ? "button" : "submit"}
              disabled={subscribeState !== "init"}
            >
              {subscribeState === "success" ? <ImCheckmark /> : "Sign Up"}
            </Button>
          </FormControl>
        </Stack>
        <Text
          mt={2}
          textAlign="center"
          color={subscribeState === "fail" ? "red.500" : "gray.500"}
        >
          {subscribeMessage[subscribeState]}
        </Text>
      </Container>
    </Flex>
  ) : null;
}
