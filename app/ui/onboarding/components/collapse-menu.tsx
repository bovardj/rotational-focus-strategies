import { Collapse, Text } from '@geist-ui/react';
import type { JSX } from 'react';

export default function Component({ title, text }: { title: string; text: string }): JSX.Element {
  return (
    <Collapse title={title}>
      <Text className="mb-4">{text}</Text>
    </Collapse>
  );
}
