"use client";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { MENU } from "./Content";
import Link from "next/link";
import { usePathname } from "next/navigation";

function MobleFooter() {
  const pathName = usePathname();
  const isActiveRoute = (route?: string) => {
    if (route === pathName) {
      return true;
    }
  };
  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0 bg-white z-50 border-t-2 border-[#1A202C]">
      <List
        disablePadding
        sx={{
          display: "flex",
          "& li.MuiListItem-root svg": {
            fontSize: "24px !important",
            width: "24px",
            height: "24px",
            objectFit: "contain",
            margin: "0 auto",
          },
          "& .MuiListItemIcon-root": {
            display: "block",
          },
        }}
      >
        {MENU.map((item: any, index) => (
          <ListItem
            key={item.title}
            disablePadding
            sx={{ color: isActiveRoute(item.link) ? "#2C72F6" : "#969ba3" }}
          >
            <Link href={item.link} key={item.title} passHref={true}>
              <ListItemButton sx={{ display: "block" }}>
                <ListItemIcon
                  sx={{
                    color: isActiveRoute(item.link) ? "#2C72F6" : "#969ba3",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{
                    textAlign: "center",
                    fontSize: "12px",
                    "& span": {
                      fontSize: "12px",
                      fontWeight: "500",
                      letterSpacing: "-0.12px",
                    },
                  }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default MobleFooter;
