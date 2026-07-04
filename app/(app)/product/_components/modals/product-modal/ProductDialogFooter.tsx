import { Button } from "@heroui/react";

interface Props {
  closeDrawer: (open: boolean) => void;
}

const Footer = ({ closeDrawer }: Props) => {
  return (
    <footer className="flex justify-end w-full gap-1 px-4 py-2">
      <Button
        variant="ghost"
        type="button"
        className="font-semibold bg-gray-200 dark:bg-zinc-700"
        onPress={() => closeDrawer(false)}
      >
        Close
      </Button>
      <Button type="submit" form="productForm" className="font-semibold text-white bg-emerald-500">
        Save
      </Button>
    </footer>
  );
};

export default Footer;
