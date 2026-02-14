import styled from "@emotion/styled";
import { type FC, type FormEvent, type ReactElement, useCallback } from "react";
import { Stack } from "@/components/unit/Stack";
import { Text } from "@/components/unit/Text";

const Item = styled(Stack)`
  &:not(:last-of-type)::after {
    content: "";
    display: block;
    margin-inline: 12px;
    height: 12px;
    width: 1px;
    background-color: var(${({ theme }) => theme.text.primaryDisabled});
  }
`;

const _HiddenInput = styled.input`
  width: 0;
  height: 0;
  opacity: 0;
`;

const Label = styled(Text)<{ selected: boolean }>`
  color: var(
    ${({ theme, selected }) => {
      return selected ? theme.text.primaryInversed : theme.text.primaryDisabled;
    }}
  );
  opacity: ${({ selected }) => (selected ? 1 : 0.4)};
  display: inline-flex;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  items: [ReactElement, ReactElement];
  name: string;
  defaultKey: string | undefined;
  onSelect: (key: string) => void;
}

export const SegmentControl: FC<Props> = ({ items, name, defaultKey, onSelect }) => {
  const handleOnInput = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      onSelect(e.currentTarget.value);
    },
    [onSelect],
  );

  return (
    <Stack alignItems="center" height="fit-content">
      {items.map((item) => {
        const value = item.key?.toString();

        return (
          <Item key={item.key} alignItems="center">
            <_HiddenInput type="radio" name={name} value={value} id={value} onInput={handleOnInput} />
            <Label as="label" selected={value === defaultKey} htmlFor={value} fz={14}>
              {item}
            </Label>
          </Item>
        );
      })}
    </Stack>
  );
};
