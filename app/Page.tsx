"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Grid,
  Backdrop,
  IconButton,
} from "@mui/material";
import Fuse from "fuse.js";
import { Design } from "../types/design";
import EmblaCarouselReact from "embla-carousel-react";
import CloseIcon from "@mui/icons-material/Close";

// Fetch designs from public folder simulating git-driven JSON
async function fetchDesigns(): Promise<Design[]> {
  const res = await fetch("/data/designs.json");
  return res.json();
}

export default function HomePage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchDesigns().then(setDesigns);
  }, []);

  // Fuse.js config to search multiple keys
  const fuse = useMemo(() => {
    return new Fuse(designs, {
      keys: ["Bike", "Name", "AuthorId", "Tags"],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [designs]);

  // Filter results based on search query
  const filteredDesigns = useMemo(() => {
    if (!search.trim()) return designs;
    return fuse.search(search).map(({ item }) => item);
  }, [search, fuse, designs]);

  const openCarousel = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const closeCarousel = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  return (
    <Box
      sx={{
        p: 2,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {/* Search bar */}
      <TextField
        variant="outlined"
        placeholder="Search by name, bike, author or tags"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
        inputProps={{ "aria-label": "search motorcycle designs" }}
      />

      {/* Gallery grid */}
      <Grid container spacing={2} sx={{ overflowY: "auto", flexGrow: 1 }}>
        {filteredDesigns.map((design, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={design.Name + design.AuthorId}>
            <Card
              sx={{ cursor: "pointer", height: "100%" }}
              onClick={() => openCarousel(idx)}
              aria-label={`Open carousel for ${design.Name}`}
            >
              <CardMedia
                component="img"
                height="180"
                image={design.Thumbnail}
                alt={`${design.Name} thumbnail`}
              />
              <CardContent>
                <Typography variant="h6" noWrap title={design.Name}>
                  {design.Name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap title={design.Bike}>
                  {design.Bike}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Carousel overlay */}
      <Backdrop
        open={selectedIndex !== null}
        onClick={closeCarousel}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        {selectedIndex !== null && (
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: "relative",
              width: { xs: "90vw", md: "70vw" },
              height: { xs: "70vh", md: "80vh" },
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              display: "flex",
              flexDirection: "column",
              p: 2,
            }}
          >
            <IconButton
              onClick={closeCarousel}
              sx={{ position: "absolute", top: 8, right: 8, color: "text.primary" }}
              aria-label="Close carousel"
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h5" gutterBottom>
              {filteredDesigns[selectedIndex].Name} — {filteredDesigns[selectedIndex].Bike}
            </Typography>

            <EmblaCarouselReact
              htmlTagName="div"
              options={{ loop: true }}
              style={{ flexGrow: 1, overflow: "hidden" }}
            >
              {filteredDesigns[selectedIndex].Collection.map((img, i) => (
                <div key={i} className="embla__slide" style={{ padding: "0 10px" }}>
                  <img
                    src={img}
                    alt={`${filteredDesigns[selectedIndex].Name} image ${i + 1}`}
                    style={{ width: "100%", borderRadius: 8, maxHeight: "100%" }}
                  />
                </div>
              ))}
            </EmblaCarouselReact>
          </Box>
        )}
      </Backdrop>
    </Box>
  );
}