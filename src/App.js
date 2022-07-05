import { useState } from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Box,
  Button,
  Grid
 } from '@mui/material';
import fhirpath from "fhirpath";
import DEMO_DATA from "./data/example.json";
import MAP_DATA from "./mapping/R4Bto5.4.json"

function keyPlacer (key, value, obj) {
  if (key.includes('.')) {
    const keys = key.split('.');
    const curKey = keys.slice(0, 1);
    const newKey = keys.slice(1);
    obj[curKey] = obj[curKey] || {};
    keyPlacer(newKey, value, obj[curKey])
  } else {
    obj[key] = value;
  }
}

function App() {
  const [data, setData] = useState(JSON.stringify(DEMO_DATA, null, 2));
  const [out, setOut] = useState();
  const handleConvert = () => {
    const out = {};
    for (const key in MAP_DATA) {
      if (Array.isArray(MAP_DATA[key])) {
        (MAP_DATA[key]).forEach((item) => {
          keyPlacer(item, fhirpath.evaluate(JSON.parse(data), key), out);
        });
      } else {
        keyPlacer(MAP_DATA[key], fhirpath.evaluate(JSON.parse(data), key), out);
      }
    }
    setOut(JSON.stringify(out, null, 2));
  };
  const handleInput = (e) => {
    setData(e.target.value);
  }
  return (
    <>
      <AppBar position="static">
      <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Vulcan FHIR-to-OMOP
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box mb={2} />
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Typography>FHIR HL7 R4B</Typography>
            <TextField
              multiline
              onChange={handleInput}
              value={data}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" onClick={handleConvert}>&nbsp;▶&nbsp;Convert&nbsp;▶&nbsp;</Button>
          </Grid>
          <Grid item xs={5}>
            <Typography>OMOP 5.4</Typography>
            <TextField
                multiline
                value={out}
                fullWidth
              />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;
