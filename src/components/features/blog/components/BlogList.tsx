import styled from "@emotion/styled";
import type { FC } from "react";
import type { TypeListBlogResponse } from "../../../../server/schema";
import { Text } from "../../../unit/Text";

const _List = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 320px);
  grid-template-rows: 480px;
  list-style: none;
  width: fit-content;
`;

const _Item = styled.li`
  width: 100%;
  height: 100%;
  border: 0.25px solid black;
  color: white;
  padding: 16px;
  background-color: var(${({ theme }) => theme.surface.primary});
`;

type Props = {
  blogs: TypeListBlogResponse["blogs"];
};

export const BlogList: FC<Props> = ({ blogs }) => {
  return (
    <_List>
      {blogs.map((blog) => {
        return (
          <_Item key={blog.id}>
            <Text as="h3" ff="Zen Old Mincho" fw="lighter" fz={12}>
              {blog.title}
            </Text>
          </_Item>
        );
      })}
    </_List>
  );
};
