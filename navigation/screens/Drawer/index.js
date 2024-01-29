import React from "react";
import { render } from "react-dom";

// emotion Styling
import styled from "@emotion/styled";

// Material UI
import {
  Button,
  Checkbox,
  Drawer,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormGroup,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// Initial Filter List & Value
const initialList = {
  sortby: {
    Newest: true,
    Oldest: false,
    "Lowest Price": false,
    "Highest Price": false
  },
  size: {
    XS: false,
    S: true,
    M: true,
    L: false
  },
  color: {
    Navy: false,
    Blue: false,
    "Olive Green": false,
    Black: false
  },
  brand: {
    "Marc Jacobs": false,
    NIKE: false
  }
};

const FilterDrawer = ({ open, close, list }) => {
  const payload = {
    sortby: Object.keys(list.sortby).filter(i => list.sortby[i])[0],
    size: Object.keys(list.size).filter(i => list.size[i]),
    color: Object.keys(list.color).filter(i => list.color[i]),
    brand: Object.keys(list.brand).filter(i => list.brand[i])
  };
  const [filterList, setFilterList] = React.useState(list);

  const Container = styled.div`
    .MuiListItem-root {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    .MuiListItemIcon-root {
      justify-content: flex-end;
    }
    .MuiButton-root {
      border-radius: 0px;
      margin: 16px;
    }
    .MuiButton-fullWidth {
      width: calc(100% - 32px);
    }
  `;

  const StyledExpensionPanel = styled(ExpansionPanel)`
    box-shadow: none !important;
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 0;
    &:not(:last-child) {
      border-bottom: 0;
    }
    &:before {
      display: none;
    }
    .MuiExpansionPanelSummary-content {
      justify-content: space-between;
      align-items: center;
      .secondary {
        font-size: 0.8rem;
        opacity: 0.5;
      }
    }
    .MuiRadio-root {
      .MuiSvgIcon-root {
        /* font-size: 1.2rem; */
      }
    }
    .btn-clear {
      position: absolute;
      top: 20px;
      left: 0px;
      color: rgba(0, 0, 0, 0.4);
      text-decoration: underline;
      font-size: 0.8rem;
      text-transform: unset;
    }
  `;

  ///////////// Checkbox Row /////////////
  const CheckBoxList = ({ list, title, keyname }) => {
    const [value, setValue] = React.useState(list);
    const CheckBoxSet = ({ name, onChange, checked }) => (
      <FormControlLabel
        control={<Checkbox color="primary" />}
        label={name}
        value={name}
        onChange={onChange}
        checked={checked}
      />
    );

    const handleChange = name => event => {
      const newValue = { ...value, [name]: event.target.checked };
      setValue(newValue);
      payload[keyname] = Object.keys(newValue).filter(v => newValue[v]);
      console.log("payload", payload);
    };
    const reset = () => {
      const newValue = list;
      Object.keys(list).forEach(i => (newValue[i] = false));
      setValue(newValue);
      payload[keyname] = [];
    };
    const selected = Object.entries(value)
      .filter(([key, value]) => value)
      .map(([key, value]) => key)
      .join(", ");
    return (
      <StyledExpensionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <span>{title}</span>
          <span className="secondary">{selected}</span>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <FormControl>
            <FormGroup>
              {Object.keys(value).map(item => {
                // console.log(item);
                return (
                  <CheckBoxSet
                    name={item}
                    onChange={handleChange(item)}
                    key={item}
                    checked={value[item]}
                  />
                );
              })}
            </FormGroup>
          </FormControl>
          {selected.length > 0 && (
            <Button className="btn-clear" onClick={reset}>
              Clear Filters
            </Button>
          )}
        </ExpansionPanelDetails>
      </StyledExpensionPanel>
    );
  };

  ///////////// Radio Row /////////////
  const RadioList = ({ list, title, keyname }) => {
    const initial = Object.keys(list).filter(i => list[i]);
    const [value, setValue] = React.useState(initial[0]);
    const RadioSet = ({ name }) => (
      <FormControlLabel
        control={<Radio color="primary" />}
        label={name}
        value={name}
      />
    );
    const handleChange = event => {
      const newValue = event.target.value;
      setValue(newValue);
      payload[keyname] = newValue;
      console.log(payload);
    };
    return (
      <StyledExpensionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <span>{title}</span>
          <span className="secondary">{value}</span>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <FormControl>
            <RadioGroup value={value} onChange={handleChange}>
              {Object.keys(list).map(item => (
                <RadioSet name={item} key={item} />
              ))}
            </RadioGroup>
          </FormControl>
        </ExpansionPanelDetails>
      </StyledExpensionPanel>
    );
  };

  const submit = () => {
    const newList = initialList;
    newList.sortby[payload.sortby] = true;
    payload.size.forEach(key => (newList.size[key] = true));
    payload.color.forEach(key => (newList.color[key] = true));
    payload.brand.forEach(key => (newList.brand[key] = true));
    setFilterList(newList);
    close();
  };

  return (
    <Drawer anchor="bottom" open={open} onClose={close}>
      <Container>
        <RadioList list={filterList.sortby} title="Sort by" keyname="sortby" />
        <CheckBoxList list={filterList.size} title="Sizes" keyname="size" />
        <CheckBoxList list={filterList.color} title="Colors" keyname="color" />
        <CheckBoxList list={filterList.brand} title="Brands" keyname="brand" />
        <Button variant="outlined" fullWidth size="large" onClick={submit}>
          Apply
        </Button>
      </Container>
    </Drawer>
  );
};

const App = () => {
  const [open, setOpen] = React.useState("false");
  return (
    <div>
      <button onClick={() => setOpen(true)}>OPEN DRAWER</button>
      <FilterDrawer
        open={open}
        close={() => setOpen(false)}
        list={initialList}
      />
    </div>
  );
};

render(<App />, document.getElementById("root"));
