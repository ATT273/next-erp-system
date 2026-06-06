import { Button } from "@heroui/react";

interface Props {
  closeDrawer: (open: boolean) => void;
  handleSubmit: () => void;
}

const Footer = ({ closeDrawer, handleSubmit }: Props) => {
  return (
    <footer className="sticky bottom-0 left-0 w-full flex justify-end gap-1 py-2 px-4 bg-white">
      <Button variant="ghost" type="button" className="bg-gray-200 font-semibold" onPress={() => closeDrawer(false)}>
        Close
      </Button>
      <Button className="bg-emerald-500 text-white font-semibold" onPress={handleSubmit}>
        Save
      </Button>
    </footer>
  );
};

export default Footer;
