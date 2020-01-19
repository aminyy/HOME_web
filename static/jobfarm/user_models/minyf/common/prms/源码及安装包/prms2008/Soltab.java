package prms2008;

import net.casnw.home.annotation.AccessType;
import net.casnw.home.annotation.Component;
import net.casnw.home.annotation.Parameter;
import net.casnw.home.annotation.Variable;
import net.casnw.home.core.AbstractComponent;

@Component(name = "Soltab",
author = "George H. Leavesley",
createTime = "2012-01-01",
description = "Solar Radiation Computation.This module computes the potential solar radiation and the sunrise and sunset times for a horizontal surface and for any slope/aspect combination. ")
    
public class Soltab extends AbstractComponent {

    // constants ///////////////////////////////////////////////////////////////
    static final double CLOSEZERO = 1.0E-15;
    static final double RADIANS = Math.PI/180.0;
    static final double TWOPI = 2 * Math.PI;
    static final double DAYSYR = 365.242;
    static final double PI_12 = 12. / Math.PI;
    static final double ECCENTRICY = 0.01671;
    static final double DEGDAY = 360.0/DAYSYR;
    static final double DEGDAYRAD = DEGDAY * RADIANS;

    // private fields //////////////////////////////////////////////////////////
    double e[];
    /* solar declination */
    double dm[];

    // Input Params ////////////////////////////////////////////////////////////
    @Parameter(description = "Number of HRUs.")
    public int ndays;

    @Parameter(description = "Number of radiation planes.")
    public int nradpl;

    @Parameter(description = "Latitude of each radiation plane")
    public double[] radpl_lat;

    @Parameter(description = "Aspect for each radiation plane")
    public double[] radpl_aspect;

    @Parameter(description = "Slope of each radiation plane, specified as change in vertical length divided by change in horizontal length")
    public double[] radpl_slope;

    // Output vars ////////////////////////////////////////////////////////////
    @Parameter(description = "Latitude of the basin, computed as an average of the radiation plane latitudes.")
    public double basin_lat;

    @Parameter(description = "Flag to indicate in which hemisphere the model resides  (0=Northern; 1=Southern)")
    public int hemisphere;

    @Parameter(description = "Cosine of each radiation plane slope")
    public double[] radpl_cossl;

    @Parameter(description = "Hours between sunrise and sunset for each radiation plane")
    public double[][] sunhrs_soltab;

    @Parameter(description = "Potential daily shortwave radiation for each radiation plane")
    public double[][] radpl_soltab;

    @Override
    public void init() {
        
        // Compute potential solar radiation and sunlight hours for each HRU
        // for each day of year
        //
        // References -- you *will* need these to figure out what is going on:
        //   Swift, L.W., Jr., 1976, Algorithm for solar radiation on mountain
        //   slopes: Water Resources Research, v. 12, no. 1, p. 108-112.
        //
        //   Lee, R., 1963, Evaluation of solar beam irradiation as a climatic parameter
        //   of mountain watersheds, Colorado State University Hydrology Papers, 2, 50 pp.
        
        radpl_cossl = new double[nradpl];
        radpl_soltab = new double[366][nradpl];
        sunhrs_soltab = new double[366][nradpl];
        e  = new double[366];
        dm = new double[366];
        
        for(int jd=1; jd <= 366; jd++) {
            double jddbl = (double) jd;
            //rsr .0172 = 2PI/365 = RADIAN_YEAR = DEGDAYRAD
            //rsr01/2006 commented out equations from Llowd W. Swift paper 2/1976
            
            e[jd-1] = 1.0 - (ECCENTRICY * Math.cos((jddbl -3.0 ) * DEGDAYRAD));
            double y = DEGDAYRAD*(jddbl-1.0);
            double y2 = 2.0 * y;
            double y3 = 3.0 * y;
            
            dm[jd-1] = 0.006918 - 0.399912*Math.cos(y) + 0.070257*Math.sin(y) - 
                    0.006758*Math.cos(y2) + 0.000907*Math.sin(y2) - 
                    0.002697*Math.cos(y3) + 0.00148*Math.sin(y3);
/*            System.out.println(jd + " e " + e[jd-1] + " dm " + dm[jd-1] + " cos " + Math.cos(jd -3 )); */  
        }
        
        basin_lat = 0.0;
        for(int n = 0; n < nradpl; n++) {
            compute_soltabr(n, radpl_slope[n], radpl_aspect[n], radpl_lat[n]);
            basin_lat = basin_lat + radpl_lat[n];
        }
        basin_lat = basin_lat / nradpl;
        
        // used in solrad modules for winter/summer radiation adjustment
        if (basin_lat > 0.0 ) {
            hemisphere = 0;  // northern
        } else {
            hemisphere = 1;  // southern
        }
    }
    
    //***********************************************************************
    //  compute soltab_potsw (potential shortwave radiation)
    //  and soltab_sunhrs (hours between sunrise and sunset)
    //  for each HRU for each day of the year.
    // from SWIFT (1976)
    //***********************************************************************
    private void compute_soltabr(int index, double slope, double aspect, double latitude) {
        
        double sl = Math.atan(slope);
        double a = aspect*RADIANS;
        
        // x0 latitude of HRU
        double x0 = latitude*RADIANS;
        double cossl = Math.cos(sl);
        radpl_cossl[index] = cossl;

        // x1 latitude of equivalent slope
        // This is equation 13 from Lee, 1963
        double x1 = Math.asin(cossl*Math.sin(x0)+Math.sin(sl)*Math.cos(x0)*Math.cos(a));
        
        // d1 is the denominator of equation 12, Lee, 1963
        double d1 = cossl*Math.cos(x0) - Math.sin(sl)*Math.sin(x0)*Math.cos(a);
        if(Math.abs(d1) < CLOSEZERO) {
            d1 = .0000000001;
        }
        
        // x2 is the difference in longitude between the location of
        // the HRU and the equivalent horizontal surface expressed in angle hour
        // This is equation 12 from Lee, 1963
        double x2 = Math.atan(Math.sin(sl)*Math.sin(a)/d1);
        if (d1 < 0.0) {
            x2 += Math.PI;
        }
        
        // r0 is the minute solar constant cal/cm2/min
        double r0 = 2.0;
        // r0 could be 1.95 (Drummond, et all 1968)
        for (int jd = 0; jd<366; jd++) {
            double d = dm[jd];
            
            // This is adjusted to express the variability of available insolation as
            // a function of the earth-sun distance.  Lee, 1963, p 16.
            // r1 is the hour solar constant cal/cm2/hour
            // r0 is the minute solar constant cal/cm2/min
            // E is the obliquity of the ellipse of the earth's orbit around the sun. E
            // is also called the radius vector of the sun (or earth) and is the ratio of
            // the earth-sun distance on a day to the mean earth-sun distance.
            double r1 = 60.*r0/(e[jd]*e[jd]);
            
            //  compute_t is the sunrise equation.
            //  t7 is the hour angle of sunset on the equivalent slope
            //  t6 is the hour angle of sunrise on the equivalent slope
            double t = compute_tr(x1, d);
            double t7 = t - x2;
            double t6 = -t - x2;
            
            //  compute_t is the sunrise equation.
            //  t1 is the hour angle of sunset on a hroizontal surface at the HRU
            //  t0 is the hour angle of sunrise on a hroizontal surface at the HRU
            t = compute_tr(x0, d);
            double t1 = t;
            double t0 = -t;
            
            // For HRUs that have an east or west direction component to their aspect, the
            // longitude adjustment (moving the effective slope east or west) will cause either:
            // (1) sunrise to be earlier than at the horizontal plane at the HRU
            // (2) sunset to be later than at the horizontal plane at the HRU
            // This is not possible. The if statements below check for this and adjust the
            // sunrise/sunset angle hours on the equivalent slopes as necessary.
            // t3 is the hour angle of sunset on the slope at the HRU
            // t2 is the hour angle of sunset on the slope at the HRU
            
//            if(index == 1) 
//                System.out.println("jd " + jd + "  d  r1  t" + d + "  " + r1 + "  " + t);           

            double t3 = (t7 > t1) ? t1 : t7;
            double t2 = (t6 < t0) ? t0 : t6;

            double solt, sunh;

            if (Math.abs(sl) < CLOSEZERO) {
                //  solt is Swift's R4 (potential solar radiation on a sloping surface cal/cm2/day)
                //  Swift, 1976, equation 6
                solt = func3r(0.0, x0, t1, t0, r1, d);
                //  sunh is the number of hours of direct sunlight (sunset minus sunrise) converted
                //  from angle hours in radians to hours (24 hours in a day divided by 2 pi radians
                //  in a day).
                sunh = (t1-t0)*PI_12;
            } else {
                if(t3 < t2) {
                    t2 = 0;
                    t3 = 0;
                }
                t6 += TWOPI;
                if (t6 < t1) {
                    solt = func3r(x2, x1, t3, t2, r1, d) + func3r(x2, x1, t1, t6, r1, d);
                    sunh = (t3-t2+t1-t6)*PI_12;
                } else {
                    t7 -= TWOPI;
                    if (t7 > t0) {
                        solt = func3r(x2, x1, t3, t2, r1, d) + func3r(x2, x1, t7, t0, r1, d);
                        sunh = (t3-t2+t7-t0)*PI_12;
                    } else {
                        solt = func3r(x2, x1, t3, t2, r1, d);
                        sunh = (t3-t2)*PI_12;
                    }
                }
            }
            
//            if(index == 0)
//                System.out.println("jd " + jd + " solt " + solt);
            
            radpl_soltab[jd][index] = solt;
            sunhrs_soltab[jd][index] = sunh;
        }
    }
    
    //  This is the sunrise equation
    //  Lat is the latitude
    //  D is the declination of the sun on a day
    //  T is the angle hour from the local meridian (local solar noon) to the
    //  sunrise (negative) or sunset (positive).  The Earth rotates at the angular
    //  speed of 15�/hour (2 pi / 24 hour in radians) and, therefore, T/15� (T*24/pi
    //  in radians) gives the time of sunrise as the number of hours before the local
    //  noon, or the time of sunset as the number of hours after the local noon.
    //  Here the term local noon indicates the local time when the sun is exactly to
    //  the south or north or exactly overhead.
    private static final double compute_tr(double lat, double d) {
        double tx = -Math.tan(lat) * Math.tan(d);
        if(tx < -1.0) {
            return Math.PI;
        } else if (tx > 1.0) {//rsr bug fix, old code would set t=acos(0.0) for tx>1 12/05
            return 0.0;
        } else {
            return Math.acos(tx);
        }
    }
           
    //  This is the radian angle version of FUNC3 (eqn 6) from Swift, 1976
    //  or Lee, 1963 equation 5.
    //  func3 (R4) is potential solar radiation on the surface cal/cm2/day
    //  V (L2) latitude angle hour offset between actual and equivalent slope
    //  W (L1) latitude of the equivalent slope
    //  X (T3) hour angle of sunset on equivalent slope
    //  Y (T2) hour angle of sunrise on equivalent slope
    //  R1 solar constant for 60 minutes
    //  D declination of sun
    private static final double func3r(double v, double w, double x, double y,
               double r1, double d) {
        return r1*PI_12*(Math.sin(d)*Math.sin(w)*(x-y) +
            Math.cos(d)*Math.cos(w)*(Math.sin(x+v)-Math.sin(y+v)));
    }

    @Override
    public void run() {
         if (radpl_cossl == null) {
            init();
        }
    }

    @Override
    public void clear() {
       
    }
}
