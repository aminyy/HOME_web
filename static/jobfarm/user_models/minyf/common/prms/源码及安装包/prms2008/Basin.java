package prms2008;

import net.casnw.home.annotation.AccessType;
import net.casnw.home.annotation.Component;
import net.casnw.home.annotation.Parameter;
import net.casnw.home.annotation.Variable;
import net.casnw.home.core.AbstractComponent;

@Component(name = "basin",
author = "George H. Leavesley",
createTime = "2012-0101",
description = "Basin setup.Check for validity of basin parameters and compute reservoir areas.",
keyword = "Routing")
public class Basin extends AbstractComponent{

    // private fields
    private static double NEARZERO = 1.0e-06;
    // Input Params
    @Parameter(description = "Number of HRUs")
    public int nhru;
    @Parameter(description = "Number of Ground water reservoirs")
    public int ngw;
    @Parameter(description = "Number of subsurface reservoirs")
    public int nssr;
    @Parameter(description = "Proportion of each HRU area that is impervious",
    unit = "decimal fraction")
    public double[] hru_percent_imperv ;
    @Parameter(description = "PArea of each HRU",
    unit = "acres")
    public double[] hru_area ;
    @Parameter(description = "Total basin area",
    unit = "acres")
    public double basin_area;
    @Parameter(description = "Index of subsurface reservoir receiving excess water from HRU soil zone")
    public int[] hru_ssres ;
    @Parameter(description = "Index of groundwater reservoir receiving excess soil water from each HRU")
    public int[] hru_gwres ;
    @Parameter(description = "Type of each HRU (0=inactive; 1=land; 2=lake; 3=swale)")
    public int[] hru_type ;
    @Parameter(description = "Selection flag for depression storage computation. 0=No; 1=Yes")
    public int dprst_flag;
    @Parameter(description = "HRU depression storage area as a decimal percent of the total HRU area",
    unit = "decimal fraction")
    public double[] hru_percent_dprst;
    @Parameter(description = "Decimal fraction of depression storage area that can flow to a stream channel. Amount of flow is a  function of storage.",
    unit = "decimal fraction")
    public int[] dprst_pct_open ;
    // Output vars
    @Variable(access = AccessType.OUT,
    description = "Basin area composed of land.",
    unit = "acres")
    public double land_area;
    @Variable(access = AccessType.OUT,
    description = "Basin area composed of water bodies.",
    unit = "acres")
    public double water_area;
    @Variable(access = AccessType.OUT,
    description = "Inverse of total basin area as sum of HRU areas",
    unit = "1/acres")
    public double basin_area_inv;
    @Variable(access = AccessType.OUT,
    description = "Number of active HRUs")
    public int active_hrus;
    @Variable(access = AccessType.OUT,
    description = "Number of active GWRs")
    public int active_gwrs;
    @Variable(access = AccessType.OUT,
    description = "Routing order for HRUs")
    public int[] hru_route_order ;
    @Variable(access = AccessType.OUT,
    description = "Routing order for ground-water reservoirs")
    public int[] gwr_route_order ;
    @Variable(access = AccessType.OUT,
    description = "Routing order for ground-water reservoirs",
    unit = "acres")
    public double[] ssres_area ;
    @Variable(access = AccessType.OUT,
    description = "Area of each groundwater reservoir. Computed by summing areas of HRUs that contribute to it",
    unit = "acres")
    public double[] gwres_area ;
    @Variable(access = AccessType.OUT,
    description = "HRU depression storage area",
    unit = "acres")
    public double[] hru_dprst ;
    @Variable(access = AccessType.OUT,
    description = "HRU depression storage area defined by DEM",
    unit = "acres")
    public double[] dem_dprst ;
    @Variable(access = AccessType.OUT,
    description = "HRU depression storage area that can flow to a stream",
    unit = "acres")
    public double[] dprst_open ;
    @Variable(access = AccessType.OUT,
    description = "HRU depression storage area that is closed and can  only spill",
    unit = "acres")
    public double[] dprst_clos ;
    @Variable(access = AccessType.OUT,
    description = "Proportion of each HRU area that is imperviousl",
    unit = "decimal fraction")
    public double[] hru_percent_impv ;
    @Variable(access = AccessType.OUT,
    description = "Impervious area of each HRU",
    unit = "acres")
    public double[] hru_imperv ;
    @Variable(access = AccessType.OUT,
    description = "Proportion of each HRU area that is pervious",
    unit = "decimal fraction")
    public double[] hru_percent_perv ;
    @Variable(access = AccessType.OUT,
    description = "Pervious area of each HRU",
    unit = "acres")
    public double[] hru_perv;

    @Override
    public void init() {
        double totarea = 0.0;
        land_area = 0.0;
        water_area = 0.0;

        hru_imperv = new double[nhru];
        hru_perv = new double[nhru];
        hru_percent_perv = new double[nhru];
        hru_percent_impv = new double[nhru];
        hru_route_order = new int[nhru];
        hru_dprst = new double[nhru];
        dem_dprst = new double[nhru];
        dprst_open = new double[nhru];
        dprst_clos = new double[nhru];

        gwr_route_order = new int[ngw];
        gwres_area = new double[ngw];
        ssres_area = new double[nssr];

        double numlakes = 0.;
        int j = -1;
        for (int i = 0; i < nhru; i++) {
            if (dprst_flag > 0) {
                dem_dprst[i] = 0.0;
                dprst_open[i] = 0.0;
                dprst_clos[i] = 0.0;
            } else {
                hru_percent_dprst[i] = 0.0;
            }
            double harea = hru_area[i];
            if (hru_type[i] != 0) {
                j = j + 1;
                hru_route_order[j] = i;
                if (hru_type[i] == 2) {
                    water_area = water_area + harea;
                    numlakes = numlakes + 1;
                } else {
                    check_imperv(i, hru_percent_imperv[i], hru_percent_dprst[i], dprst_flag);
                    hru_imperv[i] = hru_percent_imperv[i] * harea;
                    hru_perv[i] = harea - hru_imperv[i];
                    hru_percent_perv[i] = 1.0 - hru_percent_imperv[i];
                    hru_percent_impv[i] = hru_percent_imperv[i];
                    land_area = land_area + harea;
                    // added for depression storage calulations:
                    if (dprst_flag > 0) {
                        hru_dprst[i] = hru_percent_dprst[i] * harea;
                        dem_dprst[i] = hru_dprst[i];
                        dprst_open[i] = hru_dprst[i] * dprst_pct_open[i];
                        dprst_clos[i] = hru_dprst[i] * (1.0 - dprst_pct_open[i]);
                        if (dprst_open[i] < NEARZERO) {
                            dprst_open[i] = 0.0;
                        }
                        if (dprst_clos[i] < NEARZERO) {
                            dprst_clos[i] = 0.0;
                        }
                        hru_perv[i] = hru_perv[i] - hru_dprst[i];
                        hru_percent_perv[i] = hru_perv[i] / harea;
                    }
                }
            }
            totarea = totarea + harea;
            if (nssr == nhru) {
                ssres_area[i] = harea;
            }
            if (ngw == nhru) {
                gwres_area[i] = harea;
            }
        }

        double diff = (totarea - basin_area) / basin_area;
        if (basin_area > 0.0 && Math.abs(diff) > 0.01) {
            System.out.println("warning, basin_area > 1% different than sum of hru areas  "
                    + "basin_area: " + basin_area + " sum of hru areas: "
                    + totarea + " percent diff: " + diff * 100.);
        }

        active_hrus = j + 1;
        double active_area = land_area + water_area;

        if (nssr != nhru) {
            for (int i = 0; i < nssr; i++) {
                ssres_area[i] = 0.0;
            }
            for (int k = 0; k < active_hrus; k++) {
                int i = hru_route_order[k];
                j = hru_ssres[i] - 1;
                // assume if hru_type is 2, ssr has zero area
                if (hru_type[i] != 2) {
                    ssres_area[j] += hru_area[i];
                }
            }
        }
        if (ngw == nhru) {
            active_gwrs = active_hrus;
        } else {
            for (int i = 0; i < ngw; i++) {
                gwr_route_order[i] = i;
                gwres_area[i] = 0.0;
            }
            active_gwrs = ngw;
            for (int k = 0; k < active_hrus; k++) {
                int i = hru_route_order[k];
                j = hru_gwres[i] - 1;
                gwres_area[j] += hru_area[i];
            }
        }
        basin_area_inv = 1.0 / active_area;
    }

    
    @Override
    public void run() {
        if (hru_imperv == null) {
            init();
        }
        for (int k = 0; k < active_hrus; k++) {
            int i = hru_route_order[k];
            if (hru_type[i] != 2) {
                check_imperv(i, hru_percent_imperv[i], hru_percent_dprst[i], dprst_flag);
                hru_imperv[i] = hru_percent_imperv[i] * hru_area[i];
                hru_perv[i] = hru_area[i] - hru_imperv[i] - hru_dprst[i];
                hru_percent_perv[i] = 1.0 - hru_percent_imperv[i];
                hru_percent_impv[i] = hru_percent_imperv[i];
            }
        }
    }

    private void check_imperv(int ihru, double hru_pct_imperv,
            double hru_percent_dprst, int dprst_flg) {
        if (hru_pct_imperv > 0.99) {
            System.out.println("warning, hru_percent_imperv > .99 for hru: " + ihru
                    + " reset to .99, was: " + hru_pct_imperv);
            hru_percent_imperv[ihru] = 0.99;
        }
        if (dprst_flg == 1) {
            if (hru_pct_imperv + hru_percent_dprst > .99) {
                System.out.println("warning, hru_percent_imperv+hru_percent_dprst>.99 "
                        + " hru_percent_imperv has been reduced to meet this "
                        + " condition. imperv: " + hru_pct_imperv + " dprst: "
                        + hru_percent_dprst + " hru: " + ihru);
                hru_percent_imperv[ihru] = .99 - hru_percent_dprst;
            }
        }
        return;
    }

  

    @Override
    public void clear() {
        
    }
}
