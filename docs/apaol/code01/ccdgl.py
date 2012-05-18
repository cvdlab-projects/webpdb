# -*- coding: utf-8 -*-

## This program provides OpenGL display for a PDB-CCD file.
## Author: Alberto Paoluzzi (paoluzzi@dia.uniroma3.it)
## Copyright (C) 2010 Dipartimento Informatica e Automazione,
## Università Roma Tre, Rome, Italy.

## This library is free software; you can redistribute it and/or
## modify it under the terms of the GNU General Public
## License as published by the Free Software Foundation; either
## version 2.1 of the License, or (at your option) any later version.

## This library is distributed in the hope that it will be useful,
## but WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
## General Public License for more details.

## You should have received a copy of the GNU General Public
## License along with this library; if not, write to the Free Software
## Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

"""
The ccdgl library provides display for a PDB-CCD (http://www.wwpdb.org/ccd.html) file.
Ccdgl uses the PDBParser module from Bio.PDB subpackage of the Biopython package,
and the Pyplasm module (http://www.plasm.net) for geometric programming and OpenGL display.
"""

from atomic_radius import *
from Bio.PDB import PDBParser


def getPDBconnect (filename):
    """ To look a PDB file for CONECT records and return the undirected graph they codify.
    
    Return a list of pairs of atom indices.
    
    """
    myfile = open(filename,'r')
    arcs = []
    for record in myfile:
        terms = record.split()
        if terms[0] == "CONECT":
            terms = AA(eval)(terms[1:])
            node,terms = terms[0],terms[1:]
            pairs = DISTL([ node,terms ])
            arcs += [arc for arc in pairs if arc[0] < arc[1]]
    myfile.close()
    return arcs

def CCDParser (filename):
    """ To parse a PDB-CCD file looking for structure information.
    
    Return a list of Bio.PDB objects of type residue. Normally this list is a singleton,
    that has the molecule CCD code as residue ID.
    """
    parser=PDBParser()
    structure=parser.get_structure('molecule', filename)
    residues = []
    for model in structure:
        for chain in model:
            for residue in chain:
                residues += [residue]
##    model = structure[0]
##    chain = model[' ']
##    residue = chain[0]
    return residues


def graph (filename):
    """ To compute the graph of a PDB-CCD file.

    Return the pair of lists [nodes,edges], where:
    - nodes = the list of triples of node coordinates;
    - arcs = the list of unoriented arcs, i.e. of pairs of connected atom indices.
    """
    residues = CCDParser (filename)
    atoms = [atom for residue in residues for atom in residue]
    nodes = [atom.get_coord().tolist() for atom in atoms]
    arcs = getPDBconnect(filename)
    return [nodes,arcs]


def graph2edges(nodes,arcs):  # points, pairs of point indices
    """ To compute the list of pairs of triplets of coordinates.

    Return a list of:
    - edges = pairs of 3D points.
    """
    def arc2edge(arc):
        v1 = nodes[arc[0]-1]
        v2 = nodes[arc[1]-1]
        return [v1,v2]
    edges = [arc2edge(arc) for arc in arcs]
    return edges # pairs of points


def view_molecule(filename,viewType="stick"):
    """ To produce an OpenGL view of a PDB-CCD file. 

    - filename = file name string (including path and suffix)
    - viewType = "stick" (default type of view)
               | "stick and ball"
               | "empirical"
               | "calculated"
               | "van der Waals"
               | "covalent"

    The various radiuses of the ball model of atoms are imported from
    "atomic_radius.py"; the sphere and cylinder shapes from "sphere18x27.obj"
    and "cylinder4x27.obj", respectively.
    """
    residues = CCDParser(filename)
    nodes,arcs = graph(filename)
    edges = graph2edges(nodes,arcs)
    nodes = [atom.get_coord().tolist() for residue in residues for atom in residue]
    atom_types = [atom.get_id()[0]  for residue in residues for atom in residue]

    def transformSphere(batchSphere,node,atom_code,viewType):
        RADIUS_TYPE = 1
        if viewType == "empirical": RADIUS_TYPE = 1
        elif viewType == "calculated": RADIUS_TYPE = 2
        elif viewType == "van der Waals": RADIUS_TYPE = 3
        elif viewType == "covalent": RADIUS_TYPE = 4
        sx = atomic_radius[atom_code][RADIUS_TYPE]/100.
        if viewType == "stick": sx=0.15
        elif viewType == "stick and ball": sx=0.4
        batchSphere.matrix = Mat4f.translate(*node)*Mat4f.scale(sx,sx,sx)
        batchSphere.diffuse=atom_color[atom_code]
        return batchSphere

    def spheres():
        batches = []
        unitSphere = Batch.openObj("sphere18x27.obj")[0]
        for (node,atom_code) in zip(nodes,atom_types):
            batchSphere = Batch(unitSphere)
            batches += [transformSphere(batchSphere,node,atom_code,viewType)]
        return batches

    def transfCylr(batchCylinder,arc,vect,node,atom_code):
        sx = 0.15
        def vectTransform(vect):
            qz = UNITVECT(vect)
            qx = UNITVECT(VECTPROD([ vect,[0,0,1] ]))
            qy = VECTPROD([ qz,qx ])
            Rot = TRANS([qx,qy,qz]) 
            Rot = CAT([ Rot[0]+[0.], Rot[1]+[0.], Rot[2]+[0.], [0.,0.,0.,1.] ])
            h = VECTNORM(vect)
            return h,Rot
        h,Rot = vectTransform(vect)
        batchCylinder.matrix = \
            Mat4f.translate(*node) * Mat4f(*Rot) * Mat4f.scale(sx,sx,h/2)
        batchCylinder.diffuse = atom_color[atom_code]
        return batchCylinder

    def cylinders():
        batches = spheres()
        unitCylinder = Batch.openObj("cylinder4x27.obj")[0]        
        vects = [VECTDIFF([edge[1],edge[0]]) for edge in edges]
        for (arc,vect) in zip(arcs,vects):
            batchCyl = Batch(unitCylinder)
            batches += [transfCylr(batchCyl,arc,vect,nodes[arc[0]-1],atom_types[arc[0]-1])]
            batchCyl = Batch(unitCylinder)
            batches += [transfCylr(batchCyl,arc,AA(C(PROD)(-1))(vect),nodes[arc[1]-1],atom_types[arc[1]-1])]
        graph0 = MKPOL([nodes,arcs,None])
        batches += Plasm.getBatches(graph0)
        return batches

    # organize the batch in a loose octree
    NO_CONECT = True
    if NO_CONECT: octree = Octree(cylinders())
    else: octree = Octree(cylinders())
    # create the viewer and run it
    viewer = Viewer(octree)
    viewer.Run()

if __name__ == "__main__":

    # basic molecule visualization
    graph0 = MKPOL(graph('aminoacids/ALA.pdb')+[None]); VIEW(graph0)

    # advanced molecule visualization
    view_molecule("aminoacids/ALA.pdb","stick")
    view_molecule("aminoacids/ALA.pdb","van der Waals")
    view_molecule("aminoacids/ALA.pdb","stick")
    view_molecule("aminoacids/ALA.pdb","empirical")
    view_molecule("aminoacids/ALA.pdb","calculated")
    view_molecule("aminoacids/ALA.pdb","covalent")
    view_molecule("aminoacids/ALA.pdb","van der Waals")
    view_molecule("aminoacids/ALA.pdb","stick and ball")

