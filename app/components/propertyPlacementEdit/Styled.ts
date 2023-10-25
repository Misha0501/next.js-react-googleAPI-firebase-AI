import { Stepper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const MuiStepper = styled(Stepper)(({ theme }) => ({
  justifyContent: "space-between",
  ".MuiStepConnector-root": {
    display: "none",
  },
  ".MuiStep-root": {
    padding: "15px 50px",
    width: "25%",
    textAlign: "center",
    background: "#fff",
  },
  ".MuiStep-root:has(span):has(.Mui-active)": {
    background: "#4785FD",
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
  ".MuiStepLabel-label": {
    fontWeight: "bold",
  },
  ".MuiStepLabel-label.Mui-active": {
    fontWeight: "bold",
    color: "#fff",
  },

  ".Mui-active": {
    color: "#fff",
  },
  ".css-1vyamtt-MuiStepLabel-labelContainer": {
    width: "auto",
  },
  ".MuiStepLabel-root": {
    justifyContent: "center",
  },
  ".MuiSvgIcon-root.Mui-completed ": {
    stroke: "#222",
    color: "#fff",
  },
}));
