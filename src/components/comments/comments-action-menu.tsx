import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import DeleteCommentAlert from './delete-comment-alert';

type Props = {
  commentId: string;
  userId: string;
};

const CommentsActionMenu = ({ commentId, userId }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisHorizontalIcon className='h-4 w-4 cursor-pointer' />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='border-border'>
        <DropdownMenuGroup>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <DeleteCommentAlert commentId={commentId} userId={userId} />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CommentsActionMenu;
