import React from "react";
import { useFormikContext } from "formik";
import CONSTANTS from "../../utils/Constants";

const GenreExInclusion = () => {
  const { values, setFieldValue } = useFormikContext();
  const classOptions = { include: "include", exclude: "exclude" };

  // create a three way toggle for all the genre buttons
  // increments the index and restart from 0 if the selected index is 2
  const exInclusionToggle = (genre) => {
    const genreIncluded = values.genreInclude.includes(genre);
    const genreExcluded = values.genreExclude.includes(genre);

    // if NOT genreIncluded and NOT genreExcluded (neutral), add current value to the genreInclude arr
    if (!genreIncluded && !genreExcluded) {
      setFieldValue("genreInclude", [...values.genreInclude, genre]);
    }
    // if the genre is already in (include), remove the current value from the genreInclude arr and add it to the genreExclude arr
    else if (genreIncluded) {
      setFieldValue(
        "genreInclude",
        values.genreInclude.filter((value) => value !== genre)
      );
      setFieldValue("genreExclude", [...values.genreExclude, genre]);
    }
    // if the genre is already in genreExcluded (exclude), remove the current value from the genreExclude arr
    else if (genreExcluded) {
      setFieldValue(
        "genreExclude",
        values.genreExclude.filter((value) => value !== genre)
      );
    }
  };

  const inExcludeClassIcons = ({ include, exclude }, genre) => {
    if (values?.genreInclude?.includes(genre)) {
      return include;
    }
    if (values?.genreExclude?.includes(genre)) {
      return exclude;
    }

    return "";
  };

  const allGenres = CONSTANTS.GENRES.map((genre) => (
    <div className="genre-holder" key={`genre-inclusion-${genre}`}>
      <button
        type="button"
        className={`genre-button ${inExcludeClassIcons(
          classOptions,
          genre.toLowerCase()
        )}`}
        onClick={() => exInclusionToggle(genre.toLowerCase())}
      >
        {genre}
      </button>
    </div>
  ));

  return allGenres;
};

export default GenreExInclusion;
