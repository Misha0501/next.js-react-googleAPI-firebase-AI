import { Stepper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const MuiStepper = styled(Stepper)(({ theme }) => ({
  justifyContent: "space-between",
  alignItems: "stretch",
  ".MuiStepConnector-root": {
    display: "none",
  },
  ".MuiStep-root": {
    // stretch to the tallest sibling so no grey gaps show behind shorter steps
    alignSelf: "stretch",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "15px 50px",
    width: "25%",
    textAlign: "center",
    background: "#fff",
    // tighten padding on tablets so labels don't wrap unevenly
    [theme.breakpoints.down("lg")]: {
      padding: "12px 16px",
    },
  },
  ".MuiStep-root:has(span):has(.Mui-active)": {
    background: "#4785FD",
    color: "#fff",
  },
  ".MuiStepLabel-root": {
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  ".MuiStepLabel-label": {
    fontWeight: "bold",
    [theme.breakpoints.down("lg")]: {
      fontSize: "12px",
    },
  },
  ".MuiStepLabel-label.Mui-active": {
    fontWeight: "bold",
    color: "#fff",
  },
  ".MuiStepIcon-text": {
    display: "none",
  },
  ".MuiSvgIcon-root": {
    border: "1px solid #222222",
    borderRadius: "50%",
    width: "15px",
    height: "15px",
  },
  ".MuiSvgIcon-root.Mui-active": {
    borderColor: "#fff",
  },
  circle: {
    color: "#fff",
  },
  ".Mui-active circle": {
    color: "#4785FD",
  },
  ".Mui-active": {
    color: "#fff",
  },
  ".css-1vyamtt-MuiStepLabel-labelContainer": {
    width: "auto",
  },
  ".MuiSvgIcon-root.Mui-completed": {
    stroke: "#222",
    color: "#fff",
  },
}));
