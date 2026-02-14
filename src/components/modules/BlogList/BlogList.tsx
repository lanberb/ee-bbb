import styled from "@emotion/styled";
import type { FC } from "react";

const _List = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 320px);
  grid-template-rows: 480px;
  list-style: none;
  margin-inline: auto;
  width: fit-content;

  & li {
    width: 100%;
    height: 640px;
    border: 0.25px solid black;
  }
`;

const _Item = styled.li`
  width: 100%;
  height: 100%;
  border: 0.25px solid black;
`;

type Props = {
  blogs: [];
};

export const BlogList: FC<Props> = ({ blogs }) => {
  return (
    <_List>
      {blogs.map((blog, index) => (
        <_Item key={index.toString()}>{blog}</_Item>
      ))}
    </_List>
  );
};
