import { Box, Spinner, Center } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';

interface Props {
  code: string;
  onChange: (value: string | undefined) => void;
  language: string;
}

export const ChallengeCodeEditor = ({ code, onChange, language }: Props) => {
  return (
    <Box h="full" w="full" bg="#1e1e1e">
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={onChange}
        loading={
          <Center h="full">
            <Spinner color="green.500" />
          </Center>
        }
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          fixedOverflowWidgets: true,
        }}
      />
    </Box>
  );
};