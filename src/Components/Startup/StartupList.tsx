import { List, ListItem, ListItemText, Typography, ListSubheader,Pagination } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { Fragment, ReactElement, useEffect, useState } from "react";
import { Startup } from "../../Types/Startup";
import { StartupHttpService } from "../../Http/Startup/Startup.http.service";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      marginBottom: "20px",
      background: "#FEFEFE"
    },
    listItemContainer: {
      display: "flex",
      flexDirection: "column"

    },
    description: {
      display: "block",

    },
  })
);



export default function StartupList(): ReactElement {
  const classes = useStyles();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [maxPages, setMaxPages] = useState(0);
  const [pagedStartups,setPagedStartups] = useState<Startup[]>([]);
  const [page, setPage] = useState(1);
  
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if(startups) {
      setPagedStartups(startups.slice((page-1)*10,(page*10)))
    }
    setPage(value);
    
  };

  useEffect(() => {

    const fetchData = async () => {
      const res = await StartupHttpService.getStartups();
      // console.log(startups)

      if (startups){
        setStartups(res)
        setPagedStartups(res.slice(0,10))
        setMaxPages(Math.ceil(res.length/10))
        // console.log("Here is startups ",startups)
      }
        
    }
    fetchData();
    
  }, [])


console.log("Paged Startups",pagedStartups)
console.log("All startups",startups)

  return (
    <Fragment>
      <Pagination count={maxPages} page={page} onChange={handleChange} />
      <Typography>Page: {page}</Typography>
      <List sx={{ width: '100%' }}>

        {pagedStartups.map((startup) => (
          <ListItem key={startup.id} className={classes.listItem}>
            <div className={classes.listItemContainer}>
              <ListItemText
                className={classes.description}
                primary={startup.name}
                secondary={`Founded: ${(startup.dateFounded).getFullYear()} | ${startup.employees} | ${startup.totalFunding} $ | ${startup.currentInvestmentStage} `}
              />
              <ListItemText
                className={classes.description}
                primary={startup.shortDescription}
              />
            </div>

          </ListItem>
        ))}

      </List>
      
    </Fragment>
  )
    ;
}
